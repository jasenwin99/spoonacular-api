const prev_button = document.querySelector('#prev_button');
const next_button = document.querySelector('#next_button');
const search_button = document.querySelector('#search_button');
const txt_query = document.querySelector('#query');

let current_page;
let current_query;

const constructURL = () => {
    return window.location.origin + window.location.pathname + `?p=${current_page}&q=${current_query}`;
};

const get_render_template = (title, img, id) => {
    return ` 
            <div class="column is-one-quarter">
            <div class="card">
                <div class="card-image">
                    <figure class="image is-4by3">
                        <img src="${img}" alt="${title}">
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">${title}</p>
                        </div>
                    </div>
                    <div class="control">
                        <a href="/information/${id}" class="button is-primary is-light">View</a>
                    </div>
                </div>
            </div>
            </div>`
};

const after_search = () => {
    if(current_page==0){
        prev_button.setAttribute("disabled", "");
    }
};

const do_search = (cb) => {
    let params = {
        query: current_query,
        offset: calculate_offset()
    };

    axios.get('/searchrecipe', {
        params
    })
    .then( (response) => {
        let result = document.querySelector('#result');
        let data = response.data;
        let temp = '';
        data.results.forEach((element, index) => {
            if (index % 4 == 0) {
                temp += '<div class="columns">';
            }
            temp += get_render_template(element.title, element.image, element.id);
            if (index % 4 == 3) {
                temp += '</div>';
            }
        });
        result.innerHTML = temp;
        let control = document.querySelector('#control');
        control.classList.remove('is-hidden');
        if(cb!=null){
            cb();
        }
    });
};

const save_query_params = () => {
    const url_params = new URLSearchParams(window.location.search);
    const param_page = Number(url_params.get('p') || 0);
    const param_query =  txt_query.value || url_params.get('q') || '';
    current_page = param_page;
    current_query = param_query;
};

const init_state = () => {
    save_query_params();
    txt_query.value = current_query;
    do_search(after_search);
};

const calculate_offset = () => {
    return current_page * 12;
}

prev_button.onclick = e => {
    if (current_page > 0) {
        current_page -= 1;
    }
    window.location.href = constructURL();
};

next_button.onclick = e => {
    current_page += 1;
    window.location.href = constructURL();
};

search_button.onclick = e => {
    save_query_params();
    window.location.href = constructURL();
};

init_state();