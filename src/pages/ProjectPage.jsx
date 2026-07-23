import ProjectContext from "../useContext/Project";
import { useContext, useState } from "react";
import { Link } from "react-router-dom"

const ProjectPage = () => {
    const { getAllProjectDetails } = useContext(ProjectContext)
    console.log(getAllProjectDetails)
    return (
        <>
        <div className=""></div>
        </>
    )
}

export default ProjectPage
