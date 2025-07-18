'use client';
import React, { useEffect, useState } from 'react';
import Card from './Card';
import uuid from 'react-uuid';
import '../styles/BlogPage.css'
import Link from 'next/link';


function BlogPage() {

    const [role, setRole] = useState('user');
    const [showModel, setShowModel] = useState(false);
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [blog, setBlog] = useState([]);
    const [image, setImage] = useState(null)
    const [editID, setEditingId] = useState('');
    const [btn, setBtn] = useState('Add')


    useEffect(() => {
        let storedrole = localStorage.getItem('role');
        if (storedrole) {
            setRole(storedrole);
        }

        const fetchData = async() => {
            const res = await fetch('api/blog');
            const data = await res.json();
            setBlog(data.Blogdata)
        }

        fetchData();
    }, [])




    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !title || !content || !image) {
            alert('Fill all fields!');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'mahaveer');

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/dkn3it92b/image/upload`, {
            method: 'POST',
            body: formData
        });

        const imageData = await cloudinaryRes.json();
        const imgUrl = imageData.secure_url;

        const newBlog = {
            id: uuid(),
            author: name,
            title: title,
            content: content,
            img: imgUrl
        };

        const response = await fetch('api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBlog)
        })

        const data = await response.json();
        console.log(data);


        setName('');
        setTitle('');
        setContent('');
        setImage(null);
        setShowModel(false);
       
    };

    const EditPreLoad = (blog) => {
        setEditingId(blog.id);
        setName(blog.author);
        setTitle(blog.title);
        setContent(blog.content);
        setImage(blog.img);
        setBtn('Edit')
        setShowModel(true);
    };

    const handleEdit = async(e) =>{

        e.preventDefault();

        if (!name || !title || !content) {
            alert('Fill all fields!');
            return;
        }

        const editBlog = {
            id: editID,
            author: name,
            title: title,
            content: content,
            img:image
        };

        const res = await fetch('/api/blog',{
            method:'PATCH',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(editBlog)
        })

        const data = await res.json();
        console.log(data);

        setName('');
        setTitle('');
        setContent('');
        setImage(null);
        setShowModel(false);
        setBtn('Add');

    
    }

    const handleDelete = async(id) =>{
        const res = await fetch('api/blog',{
            method:'DELETE',
            headers:{'Content-Type' : 'application/json'},
            body:JSON.stringify({id:id})
        })

        const data = res.json();
        console.log(data);

     
    }

    return (
        <div>
            {blog.map(data => (
                <div className="py-5" key={data.id}>
                       <Card BlogID={data.id} role={role} name={data.author} img={data.img} title={data.title} content={data.content} onEdit={() => EditPreLoad(data)} onDelete={() => handleDelete(data.id)} /> 
                </div>
            ))}

            {role === 'admin' && (<button className="create-btn" onClick={() => setShowModel(true)}>+</button>)}

            {showModel && (
                <div className="modal-backdrop">
                    <div className="modal-container">
                        <form onSubmit={ btn=='Add' ? handleSubmit : handleEdit } className="blog-form">
                            <h2 className="form-heading">Create A Blog</h2>
                            <input type="text" placeholder="Enter Your Name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
                            <input type="text" placeholder="Enter the Title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                            <textarea placeholder="Enter Content" className="form-textarea" value={content} onChange={(e) => setContent(e.target.value)} />
                            <input type="file" accept="image/*" className="form-file" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
                            <div className="form-btn-group">
                                {btn == 'Add' && (<button type="submit" className="submit-btn">{btn}</button>)}
                                {btn == 'Edit' && (<button type='submit' className="submit-btn">{btn}</button>)}
                                <button type="button" className="close-btn" onClick={() => (setShowModel(false),setBtn('Add'))}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlogPage;
