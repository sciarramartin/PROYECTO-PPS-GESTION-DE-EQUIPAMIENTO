import subprocess
import urllib.request
import json

def main():
    p = subprocess.run(
        ['git', 'credential', 'fill'],
        input='protocol=https\nhost=github.com\n',
        capture_output=True,
        text=True,
        check=True
    )
    token = None
    for line in p.stdout.splitlines():
        if line.startswith('password='):
            token = line.split('=', 1)[1]
            break

    if not token:
        print("No token found")
        return

    url = 'https://api.github.com/repos/sciarramartin/PROYECTO-PPS-GESTION-DE-EQUIPAMIENTO/issues?state=all&per_page=50'
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {token}',
        'User-Agent': 'PPS-Sync',
        'Accept': 'application/vnd.github.v3+json'
    })

    with urllib.request.urlopen(req) as resp:
        issues = json.loads(resp.read().decode())
        print(f"Total issues on GitHub: {len(issues)}")
        for it in sorted(issues, key=lambda x: x['number']):
            labels = [l['name'] for l in it.get('labels', [])]
            print(f"#{it['number']:02d}: {it['title']} [{it['state']}] ({', '.join(labels)})")

if __name__ == '__main__':
    main()
