import { RefObject, useEffect } from "react";

const useDetectOutsideClick = (ref: RefObject<any>, onClick: () => void) => {
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if(ref.current && !ref.current.contains(event.target)) {
                onClick();
            }
        }

        document.addEventListener('click', handleOutsideClick, true);

        return () => {
            document.removeEventListener('click', handleOutsideClick, true)
        }
    }, [ref, onClick]);
}

export default useDetectOutsideClick;