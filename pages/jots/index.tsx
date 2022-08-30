const JotPage = () => {
    const date = (new Date()).toLocaleDateString(
        undefined, 
        {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    );

    return (
        <h1>{date}</h1>
    )
}

export default JotPage;