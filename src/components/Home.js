import React from 'react';
import '../App.scss';
import MockCard from "./MockCard";

export default function Home() {
  const titles = ["Backlog", "Ready", "In Progress", "Done", "Closed"];
  return (
    <React.Fragment>
      <div>
        <section className="lists-container center">
          {titles.map((title, idx) => {
            return (
                <div className="list" key={idx.toString()}>
                  <h3 className="list-title">{title}</h3>
                  <ul className="list-items">
                    <li><MockCard /></li>
                    <li><MockCard /></li>
                    <li><MockCard /></li>
                    <li><MockCard /></li>
                    <li><MockCard /></li>
                  </ul>
                </div>
            )
          })}
        </section>
      </div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-card"><a href="/login">Login</a></div>
        </div>
      </div>
    </React.Fragment>
  )
}
