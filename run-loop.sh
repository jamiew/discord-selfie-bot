#!/bin/bash

pull; while [ 1 ]; do pnpm build && pnpm start; sleep 2; done
