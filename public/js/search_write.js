
const searchInput = document.getElementById("search_input");
const corpList = document.querySelector(".auto_corp");
const corpAdd = document.querySelector(".register");
let corp = []
searchInput.addEventListener('keyup', async ()=>{
  if (corp.length > 0){
    //db 데이터 정리
    let value = searchInput.value.trim();
    const filterCorp = corp.filter(data => {
      const name = Hangul.disassemble(data.Corp_name).join('')
      const query = Hangul.disassemble(value).join('')
      return name.includes(query);
    }).map(data => {
      return {
        name: data.Corp_name,
        location: data.Corp_location}})
    //5개 이하로 갯수 보여주기
    const maxResults = 5;
    const resultsCount = Math.min(maxResults, filterCorp.length);
    const results = filterCorp.slice(0, resultsCount)
    
    //css 조정
    corpList.style.display = '';
    corpAdd.style.display = '';
    //li 만들기
    while (corpList.firstChild){
      corpList.removeChild(corpList.firstChild)
    }
    if(searchInput.value.length !== 0){
      results.forEach((data) => {
        const corp_elem = document.createElement('li')
        corp_elem.innerHTML = `
          <span>${data.name}</span>
          <span>${data.location}</span>
        `
        corpList.appendChild(corp_elem)
      })
    }
    // console.log(searchInput.value)
    // console.log(results[0])
    console.log('none')
  } else{
    const res = await axios.get("search_write/all")
    corp = res.data.corp
    console.log('있음')
  }
})