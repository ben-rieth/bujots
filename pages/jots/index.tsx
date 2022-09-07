import JotList from "components/jots/JotList";
import { useState } from "react";

const JotPage = () => {

    const [days, setDays] = useState<number>(7);
    const lists = [];

    for(let i = 0; i < days; i++) {
        lists.push(<JotList daysAgo={i} key={`list-${i}`}/>)
    }

    return (
        <main className="px-3">
            <button onClick={() => setDays(days + 7)}>Add Day</button>
            {lists}
        </main>
        
    )
}

export default JotPage;