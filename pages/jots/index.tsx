import JotList from "components/jots/JotList";
import { RefObject, UIEvent, useCallback, useEffect, useRef, useState } from "react";

const JotPage = () => {

    const ref = useRef<HTMLElement>();

    const [days, setDays] = useState<number>(7);
    const lists = [];

    for(let i = 0; i < days; i++) {
        lists.push(<JotList daysAgo={i} key={`list-${i}`}/>)
    }

    const handleScroll = useCallback( () => {
        console.log("scroll");
    }, []);

    useEffect(() => {
        const div = ref.current;
        div?.addEventListener('scroll', handleScroll)

        return div?.removeEventListener('scroll', handleScroll);

    }, [handleScroll])

    return (
        <main className="px-3" ref={ref as RefObject<HTMLElement>}>
            <button onClick={() => setDays(days + 7)}>Add Day</button>
            {lists}
        </main>
        
    )
}

export default JotPage;