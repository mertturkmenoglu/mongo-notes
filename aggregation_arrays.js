// Group by age
// Combine the hobbies as allHobies.
// $push operator will push every hobbies array to allHobbies array
// So it will create nested arrays
db.friends.aggregate([
    {
        $group: {
            _id: { age: '$age' },
            allHobies: {
                $push: '$hobbies'
            }
        }
    }
])

// $unwind will 'unwind' on '$hobbies' field.
// For each item in the hobbies array, it will create new documents.
// And that document will contain a 'hobbies' field and the item
// Note: Duplicates may happen
db.friends.aggregate([
    {
        $unwind: '$hobbies'
    },
    {
        $group: {
            _id: { age: '$age' },
            allHobies: {
                $push: '$hobbies'
            }
        }
    }
])

// Same as before.
// But now, $addToSet operator will treat allHobbies field as a set.
// No duplicates
db.friends.aggregate([
    {
        $unwind: '$hobbies'
    },
    {
        $group: {
            _id: { age: '$age' },
            allHobies: {
                $addToSet: '$hobbies'
            }
        }
    }
])

// Just include the first examScore from the examScores array
// $slice operator has 3 different main usages:
// $slice: ['$field', positiveIndex] takes first n element
// $slice: ['$field', negativeIndex] takes last n element
// $slice: ['$field', startIndex, n] start at an index and take n element
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            examScore: {
                $slice: ['$examScores', 1]
            }
        }
    }
])

// $size operator will give the length of the array
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            numberOfScores: {
                $size: '$examScores'
            }
        }
    }
])

// Get only scores higher than 60
// filter the examScores array
// $filter operator needs the input field
// Then you give a name to identify each element ( like arr.forEach(eachScore => ... ) )
// Then you give conditions
// Use double $$ to identify it as a variable, not a string
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            examScores: {
                $filter: {
                    input: '$examScores',
                    as: 'eachScore',
                    cond: {
                        $gt: [ '$$eachScore.score', 60 ]
                    }
                }
            }
        }
    }
])

// Get the highest score for each person  and then sort them
// First unwind the examScores array so mongo will create a document for each element of that array
// Then make a projection: Take _id, name and score (from examScores.score)
// Then sort by scores
// Then group by _id, add name and maxScore
// Then sort the last result
db.friends.aggregate([
    {
        $unwind: '$examScores'
    },
    {
        $project: {
            _id: 1,
            name: 1,
            score: '$examScores.score'
        }
    },
    {
        $sort: {
            score: -1
        }
    },
    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            maxScore: { $max: '$score' }
        }
    },
    {
        $sort: {
            maxScore: -1
        }
    }
])
