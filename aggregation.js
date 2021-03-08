// Find all females, group by location.state and find the count, then sort by the count
db.persons.aggregate([
    { $match: { gender: 'female' } },
    { $group: { _id: { state: '$location.state' }, totalPersons: { $sum: 1 } } },
    { $sort: { totalPersons: -1 } }
])

// Exclude _id, include gender, create new field called fullName.
// Concat strings (takes an array)
// $toUpper transforms '$name.first' field to all uppercase string
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            gender: 1,
            fullName: {
                $concat: [
                    { $toUpper: '$name.first'},
                    ' ',
                    { $toUpper: '$name.last'}
                ]
            }
        }
    }
])

// Exclude _id, include first name as name, include email, include gender
// Transform string date to ISODate format and store it as birthdate
// Make age a root value
// Convert longitude and latitude values to doubles
// Make location a geoJSON object
// Then group by the birth year of the people (use $isoWeekYear operator to extract year info from ISODate object)
// And count by the year
// Sort by the count
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            name: '$name.first',
            email: 1,
            gender: 1,
            birthdate: {
                $toDate: '$dob.date'
            },
            age: '$dob.age',
            location: {
                type: 'Point',
                coordinates: [
                    {
                        $convert: {
                            input: '$location.coordinates.longitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0
                        }
                    },
                    {
                        $convert: {
                            input:  '$location.coordinates.latitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0
                        }
                    }
                ]
            }
        }
    },
    {
        $group: {
            _id: { birthYear: { $isoWeekYear: '$birthdate' } },
            numPersons: { $sum: 1 }
        }
    },
    {
        $sort: {
            numPersons: -1
        }
    }
])
