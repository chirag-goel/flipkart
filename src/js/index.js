let getJSON = function (url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        let status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

getJSON('https://flipkart-mock-serve.now.sh', function (err, res) {
    const productsIds = Object.keys(res.products.compareSummary.titles);
    if(err) {
        alert('Error fetching data');
    } else{
        createSearchBox(productsIds, res.products);
    }
});

const createSearchBox = function (productsIds, productDetails, count=2) {
    let selectedProducts = productsIds.slice(0, count);
    const searchNode = document.createElement('select');
    const headingNode = document.getElementById('select-wrapper');
    headingNode.innerHTML = '';
    searchNode.innerHTML =+ '<option>Select to add product</option>';
    searchNode.addEventListener('change', function (event) {
        const selectProductId = event.target.value;
        if (selectedProducts.indexOf(selectProductId) === -1) {
            selectedProducts.push(event.target.value);
            populateProductDetails(selectedProducts, productDetails);
        } else {
            alert("Already selected");
        }

    });
    headingNode.appendChild(searchNode);
    for (let productListIndex = 0; productListIndex < productsIds.length; productListIndex++) {
        searchNode.innerHTML += `<option value="${productsIds[productListIndex]}">${productDetails.compareSummary.titles[productsIds[productListIndex]].title}</option>`;
    }
    populateProductDetails(selectedProducts, productDetails);
}

const populateProductDetails = function (selectedProducts, productDetails) {
    createTable(selectedProducts, productDetails);
    createProductHeader(productDetails.compareSummary, selectedProducts, productDetails);
}

const createTable = function (productsIds, productDetails) {
    const tableNode = document.createElement('table');
    const productPageNode = document.getElementById('product-page');
    productPageNode.innerHTML = '';
    productPageNode.appendChild(tableNode);
    const productFeatures = productDetails.featuresList;
    for (let featureindex = 0; featureindex < productFeatures.length; featureindex++) {
        const tableTrNode = document.createElement('tr');
        tableTrNode.className = "product-feature-heading";
        tableNode.appendChild(tableTrNode);
        const tableThNode = document.createElement('th');
        tableThNode.innerHTML = `${productFeatures[featureindex].title}`;
        tableTrNode.appendChild(tableThNode);
        const subFeatures = productFeatures[featureindex].features;
        for (let subFeaturesIdx = 0; subFeaturesIdx < subFeatures.length; subFeaturesIdx++) {
            const tableTrTdNode = document.createElement('tr');
            tableNode.appendChild(tableTrTdNode);
            const tableTdNode = document.createElement('td');
            tableTdNode.innerHTML = `${subFeatures[subFeaturesIdx].featureName}`;
            tableTrTdNode.appendChild(tableTdNode);
            for (let productIndex = 0; productIndex < productsIds.length; productIndex++) {
                const tableTdNode = document.createElement('td');
                tableTdNode.innerHTML = `${subFeatures[subFeaturesIdx].values[productsIds[productIndex]]}`;
                tableTrTdNode.appendChild(tableTdNode);
            }
        }
    }
}

const createProductHeader = function (summary, productIds, productDetails) {
    const headerNode = document.getElementById("product-summary-wrapper");
    headerNode.innerHTML = +'';
    for (let productSelectedIndex = 0; productSelectedIndex < productIds.length; productSelectedIndex++) {
        const productId = productIds[productSelectedIndex];
        const productSummaryCode = document.createElement('div');
        productSummaryCode.innerHTML = `<div class="product-summary">
                <img src="${summary.images[productId]}"/> 
                <div class="title">${summary.titles[productId].title}</div>
                <div class="pricing">
                    <span class="discounted-price">${summary.productPricingSummary[productId].finalPrice}</span>
                    <span class="original-price">${summary.productPricingSummary[productId].price}</span>
                    <span class="discount">${summary.productPricingSummary[productId].totalDiscount}</span>
                </div>
            </div>`;
        headerNode.appendChild(productSummaryCode);
        const deleteOption = document.createElement('div');
        deleteOption.className = 'delete';
        deleteOption.id = `${productId}`;
        deleteOption.innerHTML = `<span id="${productId}">x</span>`;
        deleteOption.addEventListener('click', function(event) {
            const newProductIds = JSON.parse(JSON.stringify(productIds));
            var index = newProductIds.indexOf(event.target.id);
            if (index > -1) {
                newProductIds.splice(index, 1);
            }
            console.log(productIds);
            createSearchBox(productIds, productDetails, newProductIds.length);
        });
        const smg = productSummaryCode.getElementsByClassName('product-summary')[0];
        smg.appendChild(deleteOption);
    }
}