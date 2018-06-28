function extractEmails(text) {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

function compareByLoginsCount(a, b) {
    if (a.users.length < b.users.length) {
        return -1;
    }

    if (a.users.length > b.users.length) {
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

    const report = list.map(item => {
        const title = item.field.find(f => f.name === 'summary').value;
        return {
            name: `${item.id} ${title}`,
            users: extractEmails(item.comment.map(c => c.text).join(' '))
        };
    });

    console.log(report.sort(compareByLoginsCount));
}

const button = document.getElementsByClassName('js-getReportBtn')[0];
button.onclick = getReport;
