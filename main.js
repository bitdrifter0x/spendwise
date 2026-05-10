const ExpenseName = document.getElementById('ExpName')
const ExpenseAmount = document.getElementById('ExpAmt')
const ExpenseCategory = document.getElementById('ExpCat')
const ExpDate = document.getElementById('ExpDate')
const Btn = document.getElementById('AddBtn')

let activeFilter = 'All'

let catfill = document.querySelectorAll('.filterPill')
catfill.forEach(element => {
    
    element.addEventListener('click', function(e){
        activeFilter = element.dataset.cat
        renderExpenses()
    })

    
});

let activeMonth = 'All'

let monthSelector = document.querySelector('.dateSelector')
monthSelector.addEventListener('change', function() {
    activeMonth = monthSelector.value
    renderExpenses()
})


let expArr = JSON.parse(localStorage.getItem('expenses')) || []

Btn.addEventListener('click', function(e) {
    e.preventDefault()
    
    let expD = ExpenseName.value
    let expA = ExpenseAmount.value
    let expC = ExpenseCategory.value
    let expDa = ExpDate.value

    ExpenseName.value = ''
    ExpenseAmount.value = ''
    ExpenseCategory.value = ''
    ExpDate.value = ''

    let exp = {
        desc : expD,
        amt : Number(expA),
        cat : expC,
        date : expDa
    }

    expArr.push(exp)

    localStorage.setItem('expenses', JSON.stringify(expArr))

    renderExpenses()

})

function renderExpenses () {

    let container = document.querySelector('.expSummary')
    container.innerHTML = ''

    let expenses = JSON.parse(localStorage.getItem('expenses'))
    if (expenses.length === 0) return
    let activeExpenses = expenses.filter(expense => {
    let expenseMonth = new Date(expense.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    let matchesMonth = activeMonth === 'All' || expenseMonth === activeMonth
    let matchesCat = activeFilter === 'All' || expense.cat === activeFilter
    return matchesMonth && matchesCat
})
    let total = expenses.reduce((sum, expense) => sum + expense.amt, 0)
    let tContainer = document.querySelector('.totalExp')
    tContainer.innerHTML = ''
    let label = document.createElement('p')
    let t = document.createElement('h3')

    t.textContent = total
    label.textContent = `Total Expenses`
    tContainer.appendChild(label)
    tContainer.appendChild(t)

    let totalTransactions = expenses.length
    let tTransaction = document.querySelector('.totalTransactions')
    tTransaction.innerHTML = ''
    let label2 = document.createElement('p')
    let tr = document.createElement('h3')
    label2.textContent = `Total Transactions`
    tr.textContent = totalTransactions
    tTransaction.appendChild(label2)
    tTransaction.appendChild(tr)
    
    let DateExp = expenses.map(expense => {
        let d = new Date(expense.date)
        return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    })

    let uniqueMonths = [...new Set(DateExp)]
    let containerDate = document.querySelector('.dateSelector')
    let previousValue = containerDate.value
    containerDate.innerHTML = '<option value="All">All Months</option>'

    uniqueMonths.forEach(element => {
        let dateO = document.createElement('option')
        dateO.value = element
        dateO.textContent = element
        containerDate.appendChild(dateO)
    })

    containerDate.value = previousValue || 'All'
    


    let colors = {
        Food: '#639922',
        Transport: '#378ADD',
        Bill: '#BA7517',
        Shopping: '#D4537E'
    }

    let count = {
        Food: 0,
        Transport: 0,
        Bill: 0
    }
    
    activeExpenses.forEach((expense, index) => {

        let p = document.createElement('div')
        let color = colors[expense.cat] || '#888'
        let formattedDate = new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        p.className = 'expenseCard'
        p.innerHTML = `<div class="dot" style="background-color: ${color}"></div>
        <div class ="detail"><div>${expense.desc}</div><div class="catExp">${expense.cat}</div></div><div class="date"> ${formattedDate} </div> <div class ="expVal"> - ${expense.amt}</div><button class="btn"></button>`
        container.appendChild(p)

        let d = p.querySelector('.btn')
        d.textContent = `×`
        d.dataset.index = index
        d.addEventListener('click', function(e) {

            expArr.splice(index, 1)
            localStorage.setItem('expenses', JSON.stringify(expArr))
            renderExpenses()

        })

        if (count[expense.cat] > 0) {
            count[expense.cat]++
            
        } else {
            count[expense.cat] = 1
        }
    });

    
    let topCategory = Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b)
    let highestCount = count[topCategory]
    let topCatResult = Object.keys(count).filter(cat => count[cat] === highestCount).length > 1 ? '-' : topCategory
    let tCat = document.querySelector('.topCat')
    tCat.innerHTML = ''
    let label3 = document.createElement('p')
    let tc = document.createElement('h3')
    label3.textContent = `Top Category`
    tc.textContent = topCatResult
    tCat.appendChild(label3)
    tCat.appendChild(tc)  
}


document.addEventListener('DOMContentLoaded', function() {
    renderExpenses()
})

