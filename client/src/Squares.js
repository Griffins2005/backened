import React from "react"

const Squares = (props) => {
    return(
        <div className="squares" onClick={props.onClick}>
          <h3>{props.value}</h3>
        </div>
    )
}
export default Squares