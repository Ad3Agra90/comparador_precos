const searchForm = document.querySelector('.search-form')
const productList = document.querySelector('.product-list')
const priceChart = document.querySelector('.price-chart')

let myChart = ''

searchForm.addEventListener('submit', async function(event){
    event.preventDefault()
    console.log(event.target[0].value)
    const inputValue = event.target[0].value
    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`)
    const products = (await data.json()).results.sort((a, b) => a.price - b.price).slice(0, 20)
    console.log(products)
    displayItems(products)
    updatePriceChart(products)
})

function displayItems(products){
    productList.innerHTML = products.map( product => `
            <div class="product-card">
                <a href="${product.permalink}" target= "blank"><img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}"></a>
                <h3>${product.title}</h3>
                <p class="product-price">${product.price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</p>
                <p class="product-store">Loja: ${product.seller.nickname}</p>
            </div> 
        `).join('')
}

function updatePriceChart(products){
    const ctx = priceChart.getContext('2d');
    priceChart.classList.add('chart-visible');
    if(myChart){
        myChart.destroy()
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(product => product.title.substring(0,20) + '...'),
            datasets:[{
                label: 'Preço (R$)',
                data: products.map( product => product.price),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1                
            }]
        },
        options: {
            responsive: true,
            scales:{
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value){
                            return ('R$ ' + value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'
                                })
                            )
                        }, 
                    },
                    plugins: {
                        legend: {
                            display:false
                        },
                        title: {
                            display:true,
                            text: 'Comparador de Preços',
                            font: {
                                size:18
                            }
                        }
                    }
                },
            },
        },
    })
}