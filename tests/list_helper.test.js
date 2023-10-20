
const { dummy, totalLikes, favoriteBlog,mostBlogs,mostLikesAuthor } = require("../utils/list_helper");
const { blogs } = require("./blogs_helper");

describe('dummy function Test', () => {

    test('dummy function should return 1', () => {
        const blogs = []
        expect(dummy(blogs)).toBe(1)
    })

})

describe('total likes', () => {

    test('when list has only one blog, equals the likes of that', () => {
        const result = totalLikes(blogs)
        expect(result).toBe(36)
    })
})

describe('favorite Blog', () => {

    test('get Blog with the most number of likes', () => {
        expect(favoriteBlog(blogs)).toEqual({
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        })
    })

})

describe('most common Author', () => { 
    test('Should return the author with most books', () => { 
        expect(mostBlogs(blogs)).toEqual({
            author: "Robert C. Martin",
            blogs: 3
          })
     })
})

describe('most likes author', () => { 
    test('should return the author with most blogs', () => { 
        console.log(mostLikesAuthor(blogs))
        expect(mostLikesAuthor(blogs)).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
          })
     })
 })