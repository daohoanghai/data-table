class Table {
  constructor(table, data, pagination) {
    this.table = table;
    this.data = data;
    this.thead = this.currentData = data;
    this.pagination = pagination;
    this.getHeaderFooter();
    this.page = 1;
    this.limit = 10;
    this.order = -1;
    this.by = "";
    this.pagination.nextBtn.addEventListener("click", () =>
      this.setPage(++this.page)
    );
    this.pagination.prevBtn.addEventListener("click", () =>
      this.setPage(--this.page)
    );
  }
  getHeaderFooter() {
    const tr = document.createElement("tr");
    const keys = Object.keys(this.data[0]);
    keys.forEach((key) => {
      const th = document.createElement("th");
      th.addEventListener("click", () => this.sort(key));
      th.innerText = key;
      tr.appendChild(th);
    });
    this.table.thead.appendChild(tr);
    this.table.tfoot.appendChild(tr.cloneNode(true));
  }
  showData() {
    const skip = (this.page - 1) * this.limit;
    const end = skip + this.limit;
    this.table.tbody.innerHTML = "";
    const keys = Object.keys(this.data[0]);
    this.currentData.slice(skip, end).forEach((el) => {
      const tr = document.createElement("tr");
      keys.forEach((key) => {
        tr.innerHTML += `<td>${el[key]}</td>`;
      });
      this.table.tbody.appendChild(tr);
    });
    this.pagination.infor.innerText = `Showing ${skip + 1} to ${
      end + 1 > this.currentData.length ? this.currentData.length : end
    } of ${this.currentData.length} entries`;
    this.updatePagination();
  }
  updatePagination() {
    const { list, nextBtn, prevBtn, infor } = this.pagination;
    const pageCount = Math.ceil(this.currentData.length / this.limit);
    if (this.page === 1) prevBtn.classList.add("disabled");
    else prevBtn.classList.remove("disabled");
    if (this.page === pageCount) nextBtn.classList.add("disabled");
    else nextBtn.classList.remove("disabled");
    list.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
      const li = document.createElement("li");
      li.innerHTML = `<a class="pagination-link ${
        this.page === i ? "is-current" : ""
      }" aria-label="Goto page ${i}">${i}</a>`;
      li.addEventListener("click", () => this.setPage(i));
      list.appendChild(li);
    }
  }
  setPage(page) {
    this.page = page;
    this.showData();
  }
  setLimit(limit) {
    this.limit = +limit;
    this.setPage(1);
  }
  search(text) {
    this.currentData = this.data.filter((e) => {
      let found = false;
      for (let key in e) {
        if (e[key].toString().includes(text)) {
          found = true;
          return found;
        }
      }
      return found;
    });
    this.setPage(1);
  }
  sort(by) {
    if (by === this.by) {
      this.order = this.order * -1;
    } else {
      this.by = by;
      this.order = 1;
    }
    this.pagination.sort.innerHTML = `sort by <b>${this.by}</b> in order <b>${
      this.order === 1 ? "increase" : "descrease"
    } </b>`;
    this.currentData.sort((a, b) => {
      let result;
      switch (by) {
        case "start_date": {
          const date1 = new Date(a.start_date).getTime();
          const date2 = new Date(b.start_date).getTime();
          result = date1 - date2;
          break;
        }
        case "age": {
          result = +a.age - +b.age;
          break;
        }
        default: {
          result = a[by] > b[by] ? 1 : a[by] < b[by] ? -1 : 0;
        }
      }
      return result * this.order;
    });
    this.setPage(1);
  }
}

const table = document.querySelector("#myTable");
const thead = document.querySelector("#myTable thead");
const tbody = document.querySelector("#myTable tbody");
const tfoot = document.querySelector("#myTable tfoot");
const pagination = {
  list: document.querySelector(".pagination-list"),
  nextBtn: document.querySelector(".pagination-next"),
  prevBtn: document.querySelector(".pagination-previous"),
  infor: document.querySelector(".information"),
  sort: document.querySelector(".sort"),
};
"asdasd".includes;
const tableObject = {
  table,
  thead,
  tbody,
  tfoot,
};
const tableIns = new Table(tableObject, data, pagination);
tableIns.showData();
tableIns.sort("name");
const options = [5, 10, 25, 50, 100];
const select = document.querySelector("select");
options.forEach((op) => {
  const opt = document.createElement("option");
  opt.value = op;
  opt.innerText = op;
  select.appendChild(opt);
});

select.addEventListener("change", (e) => {
  tableIns.setLimit(e.target.value);
});

const searchInput = document.querySelector(".input.search");

searchInput.addEventListener("input", (e) => {
  tableIns.search(e.target.value);
});
