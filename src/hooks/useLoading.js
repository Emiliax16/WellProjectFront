import { useState } from 'react';
import Icon from "../components/Icon";

function useLoading(icon = "Refresh", color = "text-blue-500", text = "Cargando...") {
    const [loading, setLoading] = useState(false);

    const loadingIcon = (
        <Icon icon={icon} classNameIcon={`${color} animate-spin`} text={text} classNameDiv={'flex flex-col items-center justify-center min-h-screen'} />
    );

    return [loading, loadingIcon, setLoading];
}

export default useLoading;