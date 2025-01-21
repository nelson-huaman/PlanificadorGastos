import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useBudget } from "../hooks/useBudget"
import AmountDisplay from "./AmountDisplay"
import "react-circular-progressbar/dist/styles.css"

function BudgetTracker() {

   const { state, totalExpenses, remainingBudget, dispatch } = useBudget();
   const presentage = +((totalExpenses / state.budget) * 100).toFixed(2);

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         <div className="felx justify-center">
            <CircularProgressbar
               value={presentage}
               styles={buildStyles({
                  pathColor: presentage === 100 ? '#CD2626' : '#3B82F6',
                  trailColor: '#f0f0f0',
                  textSize: 8,
                  textColor: presentage === 100 ? '#CD2626' : '#3B82F6',
               })}
               text={`${presentage}% Gastado`}
            />
         </div>
         <div className="flex flex-col justify-center items-center gap-8">
            <button
               className="bg-pink-700 w-full p-2 text-white uppercase font-bold rounded-lg"
               onClick={() => dispatch({type: 'reset-app'})}
            >
               Resetar App
            </button>

            <AmountDisplay
               label='Presupuesto'
               amount={state.budget}
            />

            <AmountDisplay
               label='Disponible'
               amount={remainingBudget}
            />

            <AmountDisplay
               label='Gastado'
               amount={totalExpenses}
            />

         </div>
      </div>
   )
}

export default BudgetTracker