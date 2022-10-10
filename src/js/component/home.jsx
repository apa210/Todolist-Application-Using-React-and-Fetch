import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Home = () => {

	//Declaracion de estado de la lista
    const [lista, setLista] = useState([]);

    //Declaracion de estado de la tarea
    const [tarea, setTarea] = useState("");

    // Se agrega una tarea a la lista
    const agregarTarea = e => {
        if (e.key === "Enter" && tarea !== "") {
            setLista(
                lista.concat({
                    // Se asigna la tarea a label
                    label: tarea,
					done: false
                })
            );
            // Se limpia la variable tarea
            setTarea("");
        }
    };

	//Se genera un nuevo array con todos los items menos el que quiero eliminar, se guarda en la lista
    const eliminarTarea = index => {
        setLista(lista.filter((item, i) => index != i));
    };

	// Funcion para crear un nuevo usuario y una lista vacia
	const crearUsuario = async () =>{
		const response = await fetch('https://assets.breatheco.de/apis/fake/todos/user/apa210',{
			method: "POST",
			body: JSON.stringify([]),
			headers:{
				'Content-Type': "application/json"
			}
		})
		const data = await response.json();
		console.log(data);
	}

	// Funcion para obtener la lista de tareas de la API 
	const pullAPIListaTareas = async () =>{
		try{
			const response = await fetch('https://assets.breatheco.de/apis/fake/todos/user/apa210');
			const data = await response.json();

			if (response.status === 404) {
				crearUsuario();
			} 
			setLista(data);
		}catch(err){
			console.log(err);
		}
		
	}

	// Funcion para enviar una lista de tareas a la API
	const pushAPIListaTareas = async () =>{
		if(lista.length >0){
			try{
				const response = await fetch('https://assets.breatheco.de/apis/fake/todos/user/apa210',{
					method: "PUT",
					body: JSON.stringify(lista),
					headers:{
						'Content-Type': "application/json"
					}
				})
				const data = await response.json();
				console.log(data);
			}catch(err){
				console.log(err);
			}
		}
		
	}

	// Funcion para eliminar una lista de tareas y el usuario de la API.
	const deleteAPIListaTareas = async () =>{
		if(lista.length >0){
			try{
				const response = await fetch('https://assets.breatheco.de/apis/fake/todos/user/apa210',{
					method: "DELETE",
					headers:{
						'Content-Type': "application/json"
					}
				})
				const data = await response.json();
				console.log(data);
				setLista([]);
			}catch(err){
				console.log(err);
			}
			
		}
		
	}

	useEffect(  ()=> {
		pullAPIListaTareas();
	},[])

	
	useEffect(  ()=> {
		pushAPIListaTareas();
	},[lista])
	

    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <h1>Tareas</h1>
            {/* Al presionar enter se llama la función "agregarTarea"*/}
            <form onSubmit={e => e.preventDefault()}>
                <ul className="lista-unstyled d-flex flex-column p-0">
                    <li>
                        <input
                            type="text"
                            placeholder="Escribe una tarea..."
                            className="form-control"
                            value={tarea}
                            /* Se llama a setTarea y se guarda el contenido del input en la variable tarea*/
                            onChange={e => setTarea(e.target.value)}
                            onKeyPress={e => agregarTarea(e)}
                        />
                    </li>
                    {// Se crea la lista de tareas con map
                        lista.map((item, index) => {
                            return (
                                <li key={index} className="d-flex listItem">
                                    {item.label}
                                    <span
                                        className="ml-auto"
                                        role="button"
                                        tabIndex="0"
                                        onClick={() => eliminarTarea(index)}>
                                        &nbsp;&nbsp;
										<FontAwesomeIcon
                                            className="icon"
                                            icon={faTimes}
                                        />
                                    </span>
                                </li>
                            );
                        })}
                    <li className="mt-3 d-inline-flex align-items-center">
                        <span id="number">{lista.length}</span> 
						&nbsp;item
						{lista.length > 1 || lista.length === 0 ? "s" : null} left
                        &nbsp;
                        <span className="ml-auto">
                            <a
                                href="#"
                                className="btn btn-dark"
                                // Setea una lista vacia para limpiar 
                                onClick={() => deleteAPIListaTareas()}>
                                Limpiar
                            </a>
                        </span>
                    </li>
                </ul>
            </form>
        </div>
    );
};

export default Home;
