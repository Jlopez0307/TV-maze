/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

async function searchShows(query) {
  //Makes a GET request to TV API
  const showsResponse = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
  // console.log(showsResponse.data)

  //Declares an empty array
  const showInfo = [];

  //Searches through search results of shows
  for(let show of showsResponse.data){
    //Pushes show data into showInfo array
    const data = {
      id: show.show.id,
      name: show.show.name,
      summary:show.show.summary,
      image:show.show.image
    };

    showInfo.push(data);
  }
  console.log(showInfo)
  //Returns showInfo array with showInfo
  return showInfo;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image.original}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="btn btn-info" type="button" id="show-episodes">Episodes</button>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  //Makes a GET request using show ID
  const episodesResponse = await axios.get(`https://api.tvmaze.com/episodes/${id}`);

  // console.log(episodesResponse.data);
  const episodeData = episodesResponse.data;
  //Declares array with object with episode data
  const episodeInfo = [{
      id: episodeData.id,
      name: episodeData.name,
      season: episodeData.season,
      number: episodeData.number
    }];

  // TODO: return array-of-episode-info, as described in docstring above
  // console.log(episodeInfo);
  return episodeInfo;
}

function populateEpisodes(episodes){
  const $episodesArea = $('#episodes-area');

  for(let episode of episodes){
    let $listItem = $(`
      <li>Episode Title: ${episode.name} (Season: ${episode.season}, Episode number: ${episode.number})</li>
    `)
    $episodesArea.append($listItem);
  }
  $episodesArea.show()
}

$('#shows-list').on('click', '#show-episodes', async function handleClick(e){
  console.log(e.target)
  let $showId = $(e.target).closest('.Show').data('show-id');
  let episodes = await getEpisodes($showId);
  console.log($showId)

  populateEpisodes(episodes);
})