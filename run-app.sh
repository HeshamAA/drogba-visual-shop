#!/bin/bash

echo "Frontend starting in this terminal..."

npm run dev &
FRONTEND_PID=$! # بنحتفظ بالـ ID بتاعه

echo "Frontend (PID: $FRONTEND_PID) is running in the background of this terminal."
echo "---------------------------------------------------"
sleep 2

echo "Opening new terminal for Backend..."
gnome-terminal -- bash -c "echo 'Backend terminal starting...'; \
                           cd drogba-backend; \
                           echo 'Entered backend directory, starting server...'; \
                           npm run develop; \
                           echo 'Backend process finished. Press Enter to close this terminal.'; \
                           read"

echo "Backend should be starting in the new window."
echo "This terminal is only for the Frontend now."

wait $FRONTEND_PID