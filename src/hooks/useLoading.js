import { useState } from 'react';
import Icon from "../components/icon";

function useLoading(icon = "Refresh", color = "text-blue-500", text = "Cargando...") {
    const [loading, setLoading] = useState(false);

    const loadingIcon = (
        <Icon icon={icon} classNameIcon={`${color} animate-spin`} text={text} />
    );

    return [loading, loadingIcon, setLoading];
}

export default useLoading;