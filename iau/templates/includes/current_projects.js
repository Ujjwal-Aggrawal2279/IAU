//fetch all projects with isactive = yes
let all_current_project_list = []

const fetchcurrentprojects = async()=>{
    try{
    response = await fetch(`api/method/iau_edu.hooks_call.project.current_projects`)
    if(!response.ok){
        throw new Error("Error while fetching current project details")
    }
    const data = await response.json();
    all_current_project_list = data.message;

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
    currentProject.style.margin = '0.625rem 0.625rem 0.625rem 0.625rem';  
    currentProject.style.padding = '0.125rem 0.9375rem 0.125rem 0.9375rem';
    currentProject.style.fontSize = '1.375rem';
    currentProject.style.textAlign = "center";
    currentProject.style.display = "grid";
    currentProject.style.alignItems = "flex-end";
    let start_date_obj = new Date(element.expected_start_date);
    let start_date_options = {year: "numeric", month: "long", day: "numeric"};
    let start_date_formatted = start_date_obj.toLocaleDateString("en-US", start_date_options);
    currentProject.innerHTML = `
    <p style="font-size:1.25rem;font-family: 'Encode Sans Condensed', system-ui; font-weight: 500; color: #101423;">
    ${(preferred_language_value==="ar" && element.custom_project_name_arabic)?element.custom_project_name_arabic:element.project_name}<p>
    <br><br>
    <p style="font-size:1.375rem;font-family:'Encode Sans Condensed', system-ui;"><span>${start_date_formatted}</span></p>
    <br>
    <div class="container" style="width : 100%; display: flex; justify-content: center; align-items: center;">
        <a href=${encodeURI(element.custom_attach_rfp)} target="_blank"; rel="noopener;">
            <button
                style="padding: 0.6875rem 1.25rem; background-color: #101423; color: white; font-size: 1.375rem; font-weight: 700; border: none; font-family : 'Encode Sans Condensed', system-ui; cursor : pointer;">
                ${download_button_value}
            </button>
        </a>
    </div>
    `

    current_project_container.appendChild(currentProject)
});
}


fetchcurrentprojects();