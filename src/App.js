import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [inputArray, setInputArray] = useState([]);
  const [flag, setFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);
  const [stackCordinate, setStackCordinate] = useState([]);
  const [stackText, setStackText] = useState([]);
  const [outputTextArray, setOutputTextArray] = useState([]);
  const [stack, setStack] = useState([]);
  const [path, setPath] = useState([]);
  const [count3, setCount3] = useState(0);
  const [drawPathflag, setDrawPathflag] = useState(false);
  const [turn, setTurn] = useState(false);

  function makeArray(x, y, r, Arraylength, direction) {
    function makeHorizontalArray() {
      const result = [];

      for (let ind = 0; ind < Arraylength; ind++) {
        result.push(
          `${x + ind * r},${y} ${x + ind * r + r},${y} ${x + ind * r + r},${
            y - r
          } ${x + ind * r},${y - r}`
        );
      }

      return result;
    }
    if (direction === "H") return makeHorizontalArray();
    function stackCordinateArray() {
      const result = [];

      for (let ind = 0; ind < Arraylength; ind++) {
        result.push(
          `${x},${y - ind * r} ${x + r},${y - ind * r} ${x + r},${
            y - ind * r + r
          } ${x},${y - ind * r + r}`
        );
      }

      return result;
    }
    return stackCordinateArray();
  }

  function generatePointsBetween(startPoint, endPoint, numberOfPoints) {
    console.log("call gene");
    const points = [];
    const [x, y] = startPoint;
    const [p, q] = endPoint;
    console.log(x, y, p, q);
    // Calculate the step size for interpolation
    const stepX = (p - x) / (numberOfPoints - 1);
    const stepY = (q - y) / (numberOfPoints - 1);

    for (let i = 0; i < numberOfPoints; i++) {
      const rx = x + i * stepX;
      const ry = y + i * stepY;
      points.push([rx, ry]);
    }
    return points;
  }

  let kk = null;
  useEffect(() => {
    if (flag) {
      kk = setInterval(() => {
        setCount((p) => p + 1);
      }, 500);
    }
    if (count === inputArray.length) setFlag(false);
    return () => clearInterval(kk);
  }, [count, flag]);

  // draw path animation
  let DrawPath = null;
  useEffect(() => {
    if (drawPathflag) {
      DrawPath = setInterval(() => {
        setCount3((p) => p + 1);
      }, 40);
    }
    if (count3 === path.length - 1) {
      setCount3(0);
      setDrawPathflag(false);
     
    }

    return () => clearInterval(DrawPath);
  }, [count3, drawPathflag]);
  console.log(path);

  function handleInput(e) {
    const val = e.target.value.split(",");
    setInputArray(val);
    setFlag(true);
    setCount2(val.length - 1);
    setOutputTextArray([...Array(val.length)]);
  }

  const Array1 = makeArray(100, 200, 50, inputArray.length, "H");
  const Array2 = makeArray(100, 300, 50, inputArray.length, "H");
  const stackCordinateArray = makeArray(1000, 400, 50, inputArray.length, "V");
  console.log(stackCordinateArray);

  // inputTextArray
  const textArray = Array1.map((ele) => ele.split(" "))
    .map((ele, ind) => ele.filter((ele, ind) => ind === 0 || ind === 2))
    .map((ele, ind) => ele.map((e, i) => e.split(",")))
    .map((ele, ind) => ele.map((e, i) => e.map((e, i) => parseFloat(e))))
    .map((ele, ind) => [
      (ele[0][0] + ele[1][0]) / 2,
      (ele[0][1] + ele[1][1]) / 2,
    ]);

  const outputText = Array2.map((ele) => ele.split(" "))
    .map((ele, ind) => ele.filter((ele, ind) => ind === 0 || ind === 2))
    .map((ele, ind) => ele.map((e, i) => e.split(",")))
    .map((ele, ind) => ele.map((e, i) => e.map((e, i) => parseFloat(e))))
    .map((ele, ind) => [
      (ele[0][0] + ele[1][0]) / 2,
      (ele[0][1] + ele[1][1]) / 2,
    ]);

  const stackTextArray = stackCordinateArray
    .map((ele) => ele.split(" "))
    .map((ele, ind) => ele.filter((ele, ind) => ind === 0 || ind === 2))
    .map((ele, ind) => ele.map((e, i) => e.split(",")))
    .map((ele, ind) => ele.map((e, i) => e.map((e, i) => parseFloat(e))))
    .map((ele, ind) => [
      (ele[0][0] + ele[1][0]) / 2,
      (ele[0][1] + ele[1][1]) / 2,
    ]);

  const arrowArray = textArray.map((ele, ind) => {
    const x = ele[0];
    const y = ele[1] - 30;
    const r = 16;

    return `${x},${y} ${x - r},${y - r} ${x + r},${y - r} ${x},${y} ${x},${
      y - 2 * r
    }`;
  });

  function handleAnimation() {
    if (count2 === -1) {
      if (
        stack.length !== 0 &&
        stack[stack.length - 1] <= inputArray[inputArray.length - 1]
      ) {
        // co-ordinate
        let newArray = [...stackCordinate];
        newArray.pop();
        setStackCordinate(newArray);

        // stack
        let newStack = [...stack];
        newStack.pop();
        setStack(newStack);

        return;
      }

      let newArray = [...outputTextArray];
      newArray[inputArray.length - 1] = stack[stack.length - 1];
      setOutputTextArray(newArray);

      // stack
      let newStack = [...stack];
      newStack.pop();
      setStack(newStack);
      return;
    }

    if (stack.length !== 0 && stack[stack.length - 1] <= inputArray[count2]) {
      // co-ordinate
      let newArray = [...stackCordinate];
      newArray.pop();
      setStackCordinate(newArray);

      // stack
      let newStack = [...stack];
      newStack.pop();
      setStack(newStack);

      return;
    }

    let newStack = [...stack];
    newStack.push(inputArray[count2]);
    setStack(newStack);

    if(stack.length!==0 && turn ){
      setPath(
        generatePointsBetween(
          stackTextArray[stack.length === 0 ? 0 : stack.length-1],
          outputText[count2],
          30
        )
      );
      setTurn(false); 
     } else {
      setPath(
        generatePointsBetween(
          textArray[count2],
          stackTextArray[stack.length === 0 ? 0 : stack.length],
          30
        )
      );
      setTurn(true);
    }

    if (stack.length === 0) {
      let newArray = [...outputTextArray];
      newArray[count2] = -1;
      setOutputTextArray(newArray);
    } else {
      let newArray = [...outputTextArray];
      newArray[count2] = stack[stack.length - 1];
      setOutputTextArray(newArray);
    }

    // fill stack
    let newArray = [...stackCordinate];
    newArray.push(inputArray[count2]);
    setStackCordinate(newArray);

    setDrawPathflag(true);

    setStackCordinate(stackCordinateArray.slice(0, inputArray.length - count2));
    setStackText(stackTextArray.slice(0, inputArray.length - count2));
    setCount2(count2 - 1);
    
  }
  console.log("path" , path);
  const xValues = [500, 550, 550, 700, 700, 750, 700, 700, 550, 550];
  const yValues = [200, 200, 500, 500, 200, 200, 200, 500, 500, 200]; 
  const co_ordinate = function (x,y) {
    let result = ""
    for (let i = 0; i < xValues.length; i++) {
      result += `${xValues[i] + x },${yValues[i]+y} ` 
    }
    return result;
  }
  const cord = co_ordinate(400,0);

  return (
    <div className="App">
      <input type="text" onChange={handleInput} />

      <button onClick={handleAnimation}>Move arrow</button>

      <svg width="100vw" height="100vh">
        {Array1.map(
          (ele, ind) =>
            count > ind && <polygon points={ele} stroke="black" fill="none" />
        )}

        {textArray.map(
          (ele, ind) =>
            count > ind && (
              <text x={ele[0]} y={ele[1]} stroke="black" fill="none">
                {inputArray[ind]}
              </text>
            )
        )}

        {outputText.map(
          (ele, ind) =>
           (
              <text x={ele[0]} y={ele[1]} stroke="black" fill="none">
                { turn && ind === count ? null : outputTextArray[ind] }
              </text>
            )
        )}

        {/* stackCordinate text */}
        {stackText.map(
          (ele, ind) =>
            count > ind && (
              <text x={ele[0]} y={ele[1]} stroke="black" fill="none">
                {drawPathflag &&
                (ind === stackText.length - 2 || ind === stackText.length - 1)
                  ? null
                  : stack[ind]}
              </text>
            )
        )}

        {/* Stack outline drawing */}
        <polygon points={cord} stroke="black" fill="none" />
        {/* 1,2,3,4,3  */}
        {/* co-ordinate */}
        {stackCordinate.map(
          (ele, ind) =>
            count > ind &&
            ind < stack.length && (
              <polygon points={ele} stroke="black" fill="none" />
            )
        )}

        {Array2.map(
          (ele, ind) =>
            count > ind && <polygon points={ele} stroke="black" fill="none" />
        )}

        {!flag &&
          arrowArray.map(
            (ele, ind) =>
              count2 === ind && (
                <polygon points={ele} stroke="green" fill="none" />
              )
          )}

        {path.length !== 0 && drawPathflag && (
          <text
            x={path[count3][0]}
            y={path[count3][1]}
            stroke="black"
            fill="none"
          >
            {turn ? stack[stack.length-1] : stack[stack.length-2]}
          </text>
        )}
      </svg>
    </div>
  );
}

export default App;
