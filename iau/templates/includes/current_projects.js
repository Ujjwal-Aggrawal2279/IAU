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
current_project_container.innerHTML = ''; // clear the already existing record 
let selected_language_cookie = getPreferredLanguage();
let download_button_value = (selected_language_cookie==="en")?"Download":"تحميل";


current_project_list.forEach(element => {
    const currentProject = document.createElement("div")
    currentProject.className = "current_project"
    currentProject.style.backgroundImage = 'linear-gradient(to bottom, #FFFBF1, #EAE2C4)';
    currentProject.style.margin = '10px 10px 10px 10px';  
    currentProject.style.padding = '2px 15px 2px 15px';
    currentProject.style.fontSize = '22px';
    currentProject.style.textAlign = "center";
    currentProject.style.display = "grid";
    currentProject.style.alignItems = "flex-end";
    let start_date_obj = new Date(element.expected_start_date);
    let start_date_options = {year: "numeric", month: "long", day: "numeric"};
    let start_date_formatted = start_date_obj.toLocaleDateString("en-US", start_date_options);
    currentProject.innerHTML = `
    <p style="font-size:20px;font-family: Inter, system-ui; font-weight: 500; color: #101423;">
    ${element.project_name}<p>
    <br><br>
    <p style="font-size:22px;font-family:Inter, system-ui;"><span>${start_date_formatted}</span></p>
    <br>
    <div class="container" style="width : 100%; display: flex; justify-content: center; align-items: center;">
        <a href=${encodeURI(element.custom_attach_rfp)} target="_blank"; rel="noopener;">
            <button
                style="padding: 11px 20px; background-color: #101423; color: white; font-size: 22px; font-weight: 700; border: none; font-family : Inter, sans-serif; cursor : pointer;">
                ${download_button_value}
            </button>
        </a>
    </div>
    `

    current_project_container.appendChild(currentProject)
});
}


fetchcurrentprojects();