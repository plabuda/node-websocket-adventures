.PHONY:
host:
	konsole -e python server.py &

.PHONY:
node:
	konsole -e node index.js &