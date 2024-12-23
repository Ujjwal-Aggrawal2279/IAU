//fetch all projects with isactive = yes
let all_current_project_list = []

const fetchcurrentprojects = async()=>{
    try{
    response = await fetch(`api/resource/Project?fields=["*"]&filters=[["is_active","=","Yes"]]&order_by=creation desc&limit_page_length=null`)
    if(!response.ok){
        throw new Error("Error while fetching current project details")
    }
    const data = await response.json();
    all_current_project_list = data.data;

    rendercurrentprojects(all_current_project_list);
    }
    catch(error){
        console.error("Error", error);
    }
}

// render current project into the page
const rendercurrentprojects = (current_project_list) =>{
current_project_container = document.querySelector("#current_project_listing_container");
current_project_container.innerHTML = '' // clear the already existing record 

current_project_list.forEach(element => {
    const currentProject = document.createElement("div")
    currentProject.className = "current_project"
    currentProject.style.backgroundImage = 'linear-gradient(to bottom, #FFFBF1, #EAE2C4)';
    currentProject.style.margin = '10px 10px 10px 10px';  
    currentProject.style.padding = '2px 15px 2px 15px';
    currentProject.style.textAlign = "center";
    
    currentProject.innerHTML = `
    <p class="project_name" style="font-size:15px;font-family: 'Encode Sans Condensed', system-ui; font-weight: 500; color: #101423; margin-bottom:40px;">
    ${element.project_name}<p>
    <a href=${element.custom_attach_rfp} style="text-decoration:none;" target="_blank"; rel="noopener";>
    <button type="button" style="font-size:20px; width:25%;">
    Download
    </button>
    </a>
    `

    current_project_container.appendChild(currentProject)
});
}


fetchcurrentprojects();