import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function StartModule() {
    const { moduleId } = useParams();
    const [moduleContent, setModuleContent] = useState(null);

    useEffect(() => {
        fetchModuleContent(moduleId);
    }, [moduleId]);
 
    const fetchModuleContent = async (moduleId) => {
        try {
            const response = await fetch();
            const data = await response.json();
            setModuleContent(data);
        } catch (error) {
            console.error('Error fetching module content:', error);
        }
    };



    return (
        <div style={{ padding: '20px' }}>
            <h2>Training Module</h2>
            
        </div>

    );


}

export default StartModule;