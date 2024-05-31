import { useState } from 'react';

function useSuccess() {
    const [success, setSuccess] = useState(null);

    return { success, setSuccess };
}

export default useSuccess;