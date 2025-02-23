import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// styles
import './Create.css'
import { useFetch } from '../../hooks/useFetch';


export default function Create() {

  const [title, setTitle] = useState('');
  const [method, setMethod] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const ingredientsInput = useRef(null);

  const { postData, data, error } = useFetch('http://localhost:3000/recipes', 'POST');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    postData({
      title, 
      ingredients,
      method,
      cookingTime: cookingTime + " minutes"
    });
  }

  useEffect(() => {
    if (data) {
      console.log("New Recipe has been added");
      navigate('/');
    }
    if (error) {
      console.log('Error creating recipe:'+ error);
    }
  }, [data, navigate, error]);

  const handleAddIngredient = (e) => {
      e.preventDefault();
      const ing = newIngredient.trim();
      if (ing && !ingredients.includes(ing)) {
        setIngredients(prevIngredients => [...prevIngredients, newIngredient]); 
      }
      setNewIngredient('');
      ingredientsInput.current.focus();
  }

  return (
    <div className='create'>
      <h2 className="page-title">Add a new Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Recipe title:</span>
          <input 
              type="text"
              onChange={(e) => setTitle(e.target.value)} 
              value={title}
              required
            />    
        </label>
        <label>
          <span>Recipe ingredients:</span>
          <div className='ingredients'>
            <input 
              type='text'
              onChange={(e) => setNewIngredient(e.target.value)}
              value={newIngredient}
              ref={ingredientsInput}
              />
            <button className='btn' onClick={handleAddIngredient}>add</button>
          </div>
        </label>
        <p>Current Ingredients: { ingredients.map( ingName => <em key={ingName}>{ingName}, </em> )}</p>
        <label>
          <span>Recipe method:</span>
          <textarea
            onChange={(e)=>{ setMethod(e.target.value) }}
            value={method}
            required
          />
        </label>
        <label>
            <span>Cooking time (minutes):</span>
            <input
              type='number'
              onChange={(e)=> {setCookingTime(e.target.value)}}
              value={cookingTime}
              required
            />
        </label>
        <button className='btn'>Submit</button>
      </form>
    </div>
  )
}
