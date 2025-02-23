import './App.css'
import {Route, Routes} from "react-router-dom";

function App() {

  return (
    <>
      <div className={""}>
        <Routes>
            <Route path={"/"} element={<div className={"bg-black text-white"}>Hello World!!!!!</div>} />
            <Route path={"/explorar"} element={<>Catalogo de Productos</>} />
        </Routes>
      </div>
    </>
  )
}

export default App
