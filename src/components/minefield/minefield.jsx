import React, { useMemo, useState } from "react";
import "../minefield/minefield.css";


const Mine = -1;

const Masks = {
  Transparent: null,
  Fill: "⚪️",
  Flag: "🚩",
  Question: "❓",
};

function createField(size) {
  const field = new Array(size * size).fill(0);

  function inc(x, y) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      if (field[y * size + x] === Mine) {
        return;
      }

      field[y * size + x] += 1;
    }
  }

  for (let i = 0; i < size; ) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (field[y * size + x] === Mine) {
      continue;
    } else {
      field[y * size + x] = Mine;
      i += 1;

      inc(x + 1, y);
      inc(x - 1, y);
      inc(x, y + 1);
      inc(x, y - 1);
      inc(x + 1, y - 1);
      inc(x + 1, y + 1);
      inc(x - 1, y + 1);
      inc(x - 1, y - 1);
    }
  }

  return field;
}
function showButton (){
 document.querySelector(".button").classList.remove("hidden")
}


const Minefield = () => {
 
  const size = 10

  const dimension = new Array(size).fill(null);
  const [death, setDeath] = useState(false);
  const [flag, setFlag] = useState(0);
  const [field, setField] = useState(() => createField(size));
  const [mask, setMask] = useState(() =>
    new Array(size * size).fill(Masks.Fill)
  );

  const refresh = ()=>{
    setField(() => createField(size));
    setMask(() =>
    new Array(size * size).fill(Masks.Fill));
    setFlag(0)
    setDeath(false)

  }

  const win = useMemo(
    () =>
      !field.some(
        (f, i) =>
          f === Mine && mask[i] !== Masks.Flag && mask[i] !== Masks.Transparent
      ),
    [field, mask]
  );

  return (
    <>
    <div className="button-box">
      <button className="button hidden" type="buttun" onClick={refresh}>Начать игру заново</button>
    </div>

    <div className="minefield">
      <div>
        {dimension.map((_, y) => {
          return (
            <div key={y} className="cell-y">
              {dimension.map((_, x) => {
                return (
                  <div
                    key={x}
                    className="cell-x"
                    style={{
                      backgroundColor: death
                        ? "#FAA"
                        : win
                        ? "#FFB"
                        : "aquamarine",
                    }}
                    onClick={() => {
                      showButton()
                      if (win || death) return;
                      if (mask[y * size + x] === Masks.Transparent) {
                        return;
                      }

                      const clearing = [];

                      function clear(x, y) {
                        if (x >= 0 && x < size && y >= 0 && y < size) {
                          if (mask[y * size + x] === Masks.Transparent) return;
                          clearing.push([x, y]);
                        }
                      }

                      clear(x, y);

                      while (clearing.length) {
                        const [x, y] = clearing.pop();
                        mask[y * size + x] = Masks.Transparent;

                        if (field[y * size + x] !== 0) continue;

                        clear(x + 1, y);
                        clear(x - 1, y);
                        clear(x, y + 1);
                        clear(x, y - 1);
                      }

                      if (field[y * size + x] === Mine) {
                        mask.forEach((_, i) => (mask[i] = Masks.Transparent));

                        setDeath(true);
                      }

                      setMask((prev) => [...prev]);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (win || death) return;

                      if (mask[y * size + x] === Masks.Transparent) return;

                      if (mask[y * size + x] === Masks.Fill) {
                        mask[y * size + x] = Masks.Flag;
                        setFlag(flag + 1);
                      } else if (mask[y * size + x] === Masks.Flag) {
                        mask[y * size + x] = Masks.Question;
                        setFlag(flag - 1);
                      } else if (mask[y * size + x] === Masks.Question) {
                        mask[y * size + x] = Masks.Fill;
                      }

                      setMask((prev) => [...prev]);
                    }}
                  >
                    {mask[y * size + x] !== Masks.Transparent
                      ? mask[y * size + x]
                      : field[y * size + x] === Mine
                      ? "💣"
                      : field[y * size + x] === 0
                      ? ""
                      : field[y * size + x]}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      </div>
      <div className="flag-counter">
        <div>Флаги <span>{flag}</span></div>
        <div>Мины <span>{size}</span></div>
      </div>
      
    </>
  );
};
export default Minefield;
