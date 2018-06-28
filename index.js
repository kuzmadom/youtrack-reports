function extractEmails(text) {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

function compareByLoginsCount(a, b) {
    if (a.users.length > b.users.length) {
        return -1;
    }

    if (a.users.length < b.users.length) {
        return 1;
    }

    return 0;
}

async function getReport(){
    const filter = document.getElementsByClassName('js-filter')[0].value;
    const max = 1000;

    const url = `https://youtrack.moedelo.org/youtrack/rest/issue?filter=${filter}&max=${max}`;
    const args = {
        headers: {
            Accept: 'application/json',
            pragma: 'no-cache',
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    };

    const resp = await (await fetch(url, args)).json();
    const list = resp.issue || [];

    return list.map(item => {
        const title = item.field.find(f => f.name === 'summary').value;
        const description = item.field.find(f => f.name === 'description').value;
        const users = extractEmails(description + item.comment.map(c => c.text).join(' ')) || [];
        return {
            name: `${item.id} ${title}`,
            users: users,
            url: `https://youtrack.moedelo.org/youtrack/issue/${item.id}`
        };
    });
}

const button = document.getElementsByClassName('js-getReportBtn')[0];
button.onclick = async function() {
    const items = await getReport();
    const el = document.getElementsByClassName('js-list')[0];
    el.innerHTML = items.sort(compareByLoginsCount).map(i => `<div><a href="${i.url}">${i.name} (${i.users.length})</a></div>`).join('');
};
