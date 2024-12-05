import { useEffect, useState } from "react"
import api from "../api"
import "../styles/Home.css"
import Note from "../components/Note"


function Home() {
  const [notes, setNotes] = useState([])

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")



  const getNotes = async () => {
    try {
      const response = await api.get("api/notes/")
      console.log(response)

      setNotes(() => response.data);

      console.log("Notes state updated:", response.data);
    }
    catch (error) {
      alert(error.message)
    }
  }

  const deleteNote = async (id) => {
    await api.delete(`api/notes/${id}/`)
      .then((res) => {
        getNotes()
        alert(`success : ${res.data.message}`)
      })
      .catch((err) => { alert(`error : ${err.message}`) });


  }


  const createNote = async (e) => {
    e.preventDefault()
    api.post("api/notes/", {
      title: title,
      content: content
    })
      .then((res) => {
        getNotes()
        alert("created")
      })
      .catch((err) => alert(err))
    setTitle("")
    setContent("")
  }

  useEffect(() => {
    getNotes()
  }, [])



  return (
    <div>
      <div className="container mb-5">
        <h2 className="text-center">Notes</h2>
        
          {notes.map((element) => (
            <Note key={element.id} note={element} onDelete={deleteNote}/>
          ))}
        
      </div>
      <h2 className="text-center">Create a Note</h2>
      <form onSubmit={createNote} >
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />

        <label htmlFor="content">Content:</label>
        <br />
        <input
          type="text"
          id="content"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          required
        />
        <br />
        <input type="submit" value="submit" />
      </form>
    </div>
  )
}

export default Home