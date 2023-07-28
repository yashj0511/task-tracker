import Header from "./components/Header";
import Tasks from "./components/Tasks";
import Addtask from "./components/Addtask";


import { useState,useEffect } from 'react'

function App() {
  const [showAddTask,setShowAddTask]=useState(false)

  const [tasks,setTasks]=useState([])

  useEffect(()=>{
    const getTasks=async()=>{
      const tasksFromServer=await fetchTasks()
      setTasks(tasksFromServer)
    }
    
    getTasks()
  },[])

//Fetch tasks
  const fetchTasks=async()=>
    {
      const res=await fetch('http://localhost:5000/tasks')
      const data= await res.json()
      return data;
    }

//Fetch Task

const fetchTask=async(id)=>
{
  const res=await fetch(`http://localhost:5000/tasks/${id}`)
  const data= await res.json()
  return data;
}

//Add task
const addTask=async (task)=>{
  const res=await fetch('http://localhost:5000/tasks',{method:"POST",headers:{
    'Content-type':'application/json'
  },
  body:JSON.stringify(task)
})

const data =await res.json()

setTasks([...tasks,data])

  // const id=Math.floor(Math.random()*10000)+1
  // const newTask={ id,...task }
  // setTasks([...tasks,newTask])



}
//Delete a task
const deleteTask = async(id) =>{
  await fetch(`http://localhost:5000/tasks/${id}`,{
    method:"DELETE",
  })
 setTasks(tasks.filter((task)=>task.id!==id))
}

//toggle reminder
const toggleReminder = async(id)=> 
{

  const TaskToToggle=await fetchTask(id)
  const updTask={ ...TaskToToggle,reminder: ! TaskToToggle.reminder }

  const res=await fetch(`http://localhost:5000/tasks/${id}`,{method:'PUT',headers:{
    'Content-type':'application/json'
  },
    body:JSON.stringify(updTask)
  })
  const data = await res.json()

  setTasks(tasks.map((task)=>task.id===id ? {...task,reminder:data.reminder}:task)
  )
}



  return (
    //this is jsx not html
    <div className="container">
      <Header onAdd={()=>setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      {/* && is shoeter way of doing ternary operation */}
      {showAddTask && <Addtask onAdd={addTask}/>}
      
      {
      tasks.length>0 ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>) : ('No Task to show' ) }
   

      
    </div>
   

  );
}

export default App;
