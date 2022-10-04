import { FormEvent } from "react";

const JotInput = () => {

    const submitHandler = (event: FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log(data);
    }

    return (
        <div className="fixed bottom-16 left-0 right-0 bg-white">
            
            <form name="new-jot" onSubmit={submitHandler} className="">
                <div className="relative w-fit mx-auto">
                    <input 
                        type="text"
                        name="jot-text" 
                        id="jot-text"
                        placeholder=" "
                        minLength={1}
                        className="border-b-2 border-slate-300  focus:border-sky-500 outline-none px-2 py-1 peer text-base"
                    />
                    <label 
                        htmlFor="jot-text"
                        className="invisible px-1 absolute top-[5px] left-1 text-base text-slate-300 peer-placeholder-shown:visible"
                    >
                        New Jot
                    </label>
                </div>
            </form>
            
        </div>
        
    )
}

export default JotInput;