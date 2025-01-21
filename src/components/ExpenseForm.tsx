import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import type { DraftEspense, Value } from "../types";
import { categories } from "../data/categories"
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css'
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";


function ExpenseForm() {

   const [ expense, setExpense ] = useState<DraftEspense>({
      expenseName: '',
      amount: 0,
      category: '',
      date: new Date()
   });

   const [ error, setError ] = useState('');
   const [ previousAmount, setPreviousAmount ] = useState(0);
   const { state, dispatch, remainingBudget } = useBudget();

   useEffect(() => {
      if(state.editingId) {
         const editingExpense = state.expenses.filter( currentExpense => currentExpense.id === state.editingId)[0];
         setExpense(editingExpense)
         setPreviousAmount(editingExpense.amount)
      }
   }, [state.editingId]);

   const handleChange = ( e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      const isAmountField = ['amount'].includes(name);

      setExpense({
         ...expense,
         [name]: isAmountField ? +value : value
      })
   }

   const handleChangeDate = (value: Value) => {
      setExpense({
         ...expense,
         date: value
      })
   }

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(Object.values(expense).includes('')) {
         setError('Todo los campos son obligatorios')
         return;
      }

      if((expense.amount - previousAmount) > remainingBudget) {
         setError('Ese Gasto de Sale del Presupuesto')
         return;
      }

      if(state.editingId) {
         dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
      } else {
         dispatch({type: 'add-expense', payload: {expense}})         
      }

      setExpense({
         expenseName: '',
         amount: 0,
         category: '',
         date: new Date()
      })
      setPreviousAmount(0)
   }

   return (
      <form className="space-y-5" onSubmit={handleSubmit}>
         <legend className="uppercase text-center text-2xl font-bold border-b-2 border-blue-600 py-2">{state.editingId ? 'Actualizar Cambios' : 'Nuevo Gasto'}</legend>

         {error && <ErrorMessage>{error}</ErrorMessage>}

         <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-xl">Nombre Gasto</label>
            <input type="text" id="expenseName"
               className="bg-slate-100 p-2 rounded-lg"
               placeholder="Añade el nombre del Gasto"
               name="expenseName"
               value={expense.expenseName}
               onChange={handleChange}
            />
         </div>

         <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-xl">Cantidad</label>
            <input type="number" id="amount"
               className="bg-slate-100 p-2 rounded-lg"
               placeholder="Añade la cantidad del Gasto: Ej. 300"
               name="amount"
               value={expense.amount}
               onChange={handleChange}
            />
         </div>

         <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xl">Categoría</label>
            <select id="category"
               className="bg-slate-100 p-2 rounded-lg"
               name="category"
               value={expense.category}
               onChange={handleChange}
            >
               <option value="">-- Seleccione --</option>
               {categories.map( category => (
                  <option value={category.id} key={category.id}>{category.name}</option>
               ) )}
            </select>
         </div>

         <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-xl">Fecha</label>
            
            <DatePicker
               className="bg-slate-100 p-2 border-none"
               value={expense.date}
               onChange={handleChangeDate}
            />
         </div>

         <input type="submit"
            value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'}
            className="bg-blue-700 hover:bg-blue-800 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-xl"
         />
      </form>
   )
}

export default ExpenseForm