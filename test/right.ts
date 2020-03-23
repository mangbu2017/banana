export default (data) => `<div>
    <h1>{data.name} <span>{data.age}</span></h1>
<ul>
    {data.arr.map(item => <li>item.title</li>)}
            </ul>
            </div>
`;