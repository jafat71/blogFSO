const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => {
        return acc + blog.likes
    }, 0)

}

const favoriteBlog = (blogs) => {
    return blogs.reduce((maxBlog, blog) => {
        return blog.likes > maxBlog.likes ? blog : maxBlog
    }, blogs[0])
}

const mostBlogs = (blogs) => {
    const booksCount = _.countBy(blogs.map(blog => blog.author, author => author))
    let authorWithMostBooks = Object.keys(booksCount).reduce((maxAuthor, currentAuthor) => {
        return booksCount[currentAuthor] > booksCount[maxAuthor]
            ? currentAuthor
            : maxAuthor
    }, Object.keys(booksCount)[0])
    return {
        author: authorWithMostBooks,
        blogs: booksCount[authorWithMostBooks]
    }
}

const mostLikesAuthor = (blogs) => {
    const likesCount = blogs.map(
        blog => {
            return {
                author: blog.author,
                likes: blog.likes
            }
        })
    const likesSum = likesCount.reduce((acum, blog) => {
        if (!acum[blog.author]) {
            acum[blog.author] = blog.likes
        } else {
            acum[blog.author] += blog.likes
        }
        return acum
    }, {})
    const author = Object.keys(likesSum).reduce((mostLikes, author) => {
        return (likesSum[author] > likesSum[mostLikes])
            ? author
            : mostLikes
    }, Object.keys(likesSum)[0])
    return {
        author,
        likes: likesSum[author]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikesAuthor
}