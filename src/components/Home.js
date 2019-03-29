import React from 'react';
import '../App.scss';
import MockCard from "./MockCard";

export default function Home() {
  const titles = ["Backlog", "Ready", "In Progress", "Done"];
  const cards = [3, 7, 4, 10];
  return (
    <div>
      <section className="lists-container center">
        {titles.map((title, idx) => {
          return (
              <div className="list">
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
  )
}
