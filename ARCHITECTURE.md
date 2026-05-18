# Atlas LifeOS Architecture

Atlas LifeOS is the main operational shell for the ATLAS ecosystem.

It is responsible for:
- Ask Atlas
- Command Queue
- Modules
- Daily Brief overlay
- Atlas Twin entry point
- Settings

It is not responsible for implementing every module directly.

Modules should sit under LifeOS and feed events/actions into Atlas Brain and Command Queue.

Core philosophy:
Complexity beneath. Clarity above.

Design law:
If the required information already exists, meaningful actions should usually be completable in three clicks or less.
