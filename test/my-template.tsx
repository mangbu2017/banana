// export default (item) =>
//     <div className="house-type">
//         {item.region}
//     </div>

export default (data) => (<div>
    <h1>{data.name} <span>{ `i am ${data.age} years old, my name is ${data.name}.` }</span></h1>
    <ul>
        {
            data.arr.map(item => <li>
                item.title
            </li>)
        }
    </ul>
</div>)

const right = (data) => `<div>
    ${`<h1>${data.name}${`<span>${`i am ${data.age} years old, my name is ${data.name}.`}</span>`}</h1>`}
    
</div>`;

