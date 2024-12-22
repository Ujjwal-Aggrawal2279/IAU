//fetch all projects with isactive = no
let all_past_project_list = []

const fetchpastprojects = async()=>{
    try{
    response = await fetch(`api/resource/Project?fields=["*"]&filters=[["is_active","=","No"]]&order_by=creation desc&limit_page_length=null`)
    if(!response.ok){
        throw new Error("Error while fetching past project details")
    }
    const data = await response.json();
    all_past_project_list = data.data;

    renderpastprojects(all_past_project_list);
    }
    catch(error){
        console.error("Error", error);
    }
}

const renderpastprojects = (past_project_list) =>{
past_project_container = document.querySelector("#past_project_listing_container");
past_project_container.innerHTML = '' // clear the already existing record 

past_project_list.forEach(element => {
    const pastProject = document.createElement("div")
    pastProject.className = "past_project"
    pastProject.style.backgroundImage = 'linear-gradient(to bottom, #FFFBF1, #EAE2C4)';
    pastProject.style.margin = '10px 10px 10px 10px';  
    pastProject.style.padding = '2px 2px 2px 2px';
    pastProject.style.textAlign = "center";
    
    pastProject.innerHTML = `
    <p class="project-name" style="font-size:20px;font-family: 'Encode Sans Condensed', system-ui; font-weight: 700; color: #101423; margin-bottom:20px;">
    ${element.project_name}<p>
    <a href=${element.custom_attach_rfp} style="text-decoration:none;" target="_blank"; rel="noopener";>
    <button type="button" style="font-size:20px; width:25%;">
    Download
    </button>
    </a>
    `

    past_project_container.appendChild(pastProject)
});
}


fetchpastprojects();