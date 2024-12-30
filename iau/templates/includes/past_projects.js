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

// render past project into the page
const renderpastprojects = (past_project_list) =>{
past_project_container = document.querySelector("#past_project_listing_container");
past_project_container.innerHTML = '' // clear the already existing record 

past_project_list.forEach(element => {
    const pastProject = document.createElement("div")
    pastProject.className = "past_project"
    pastProject.style.backgroundImage = 'linear-gradient(to bottom, #FFFBF1, #EAE2C4)';
    pastProject.style.margin = '10px 10px 10px 10px';  
    pastProject.style.padding = '2px 15px 2px 15px';
    pastProject.style.fontSize = '22px';
    pastProject.style.textAlign = "center";
    pastProject.style.display = "grid";
    pastProject.style.alignItems = "flex-end";
    let start_date_obj = new Date(element.expected_start_date);
    let start_date_options = {year: "numeric", month: "long", day: "numeric"};
    let start_date_formatted = start_date_obj.toLocaleDateString("en-US", start_date_options);
    pastProject.innerHTML = `
    <p style="font-size:22px;font-family: Inter, system-ui; font-weight: 500; color: #101423; margin-bottom:20px;">
    ${element.project_name}<p>
    <p style="margin-bottom:10px;font-size:22px;font-family:Inter, system-ui;"><span>${start_date_formatted}</span></p>
    <div class="container" style="width : 100%; display: flex; justify-content: center; align-items: center;">
        <a href=${encodeURI(element.custom_attach_rfp)} target="_blank"; rel="noopener;">
            <button
                style="padding: 11px 20px; background-color: #101423; color: white; font-size: 22px; font-weight: 700; border: none; font-family : Inter, sans-serif; cursor : pointer;">
                Download
            </button>
        </a>
    </div>
    `

    past_project_container.appendChild(pastProject)
});
}


fetchpastprojects();