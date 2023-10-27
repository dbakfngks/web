const express = require('express')
const app = express()
const fs = require('fs')
const template = require('./lib/template.js')
const port = 3000
const cors = require('cors')
const qs = require('querystring')


app.get('/', (req, res) => {
    // const q = req.query
    // const name = q.name
    let { name } = req.query

    fs.readdir('web_toon', (err, files) => {
        let list = template.list(files)
        fs.readFile(`web_toon/${name}`, 'utf-8', (err, data) => {
            let control = `<a href="/create">create</a> <a href="/update?name=${name}">update</a>
            <form action="delete_process" method="post">
                <input type='hidden' name='id' value='${name}'>
                <button type='submit'>delete</button>
            </form>`
            if (name === undefined) {
                name = 'web_toon'
                data = 'welcome'//error 처리
                control ='<a href="/create">create</a>'
            }
            const html = template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}`, control)
            res.send(html)
        })
    })


})

app.get('/create', (req, res) => {
    fs.readdir('web_toon', (err, files) => {
        const name = 'create'
        const list = template.list(files)
        const data = template.create()
        const html = template.HTML(name, list, data,'')
        res.send(html)
    })
})


app.get('/update', (req, res) => {
    let {name} = req.query
    fs.readdir('web_toon', (err, files) => {
        let list = template.list(files)
        fs.readFile(`web_toon/${name}`, 'utf-8', (err, content) => {
            let control = `<a href="/create">create</a> <a href="/upadate?name=${name}">update</a>
            <form action="delete_process" method="post">
                <input type='hidden' name='id' value='${name}'>
                <button type='submit'>delete</button>
            </form>`
            const data = template.update(name, content)
            const html = template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}`)
            res.send(html)
        })
    })
})


app.post('/create_process', (req, res) => {
    let body = ''
    req.on('data', (data) => {
        body = body + data
    })

    req.on('end', () => {
        const post = qs.parse(body)
        //console.log(post)
        const title = post.title
        const description = post.description
        fs.writeFile(`web_toon/${title}`, description, 'utf-8', (err) => {
            res.redirect(302, `/?name=${title}`)
        })
    })

})

app.post('/update_process', (req, res) => {
    let body = ''
    req.on('data', (data) => {
        body = body + data
    })

    req.on('end', () => {
        const post = qs.parse(body)
        //console.log(post)
        const id = post.id
        const title = post.title
        const description = post.description
        fs.rename(`web_toon/${id}`,`web_toon/${title}`, (err)=>{//이걸 먼저 넣어서 해야함
        fs.writeFile(`web_toon/${title}`, description, 'utf-8', (err) => {
            res.redirect(302, `/?name=${title}`)
        })
    })
    })

})

app.post('/delete_process', (req, res) => {
    let body = ''
    req.on('data', (data) => {
        body = body + data
    })

    req.on('end', () => {
        const post = qs.parse(body)
        //console.log(post)
        const id = post.id
        fs.unlink(`web_toon/${id}`, (err) => {
            res.redirect(302, `/`)
        })
    })

})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})