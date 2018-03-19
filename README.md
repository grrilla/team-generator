# Escape Room Team Generation

### What is this?

This script will take the selections from participants of the Groupby Escape Room event submitted via Google forms and place people on teams and fairly as possible. The basic, unsophisticated algorithm is this:
- It will start by placing everyone on their Round 1 pick (the room they ranked most preferred).
- The script enforces a maximum team size based on dividing people evenly across the rooms given the number of RSVPs received. Any team found to be in excess of that number of team members will have a team member removed at random until it has been brought down to capacity. The participants removed from the teams are entered into a pool of free agents.
-  Participants from the pool of free agents are selected one by one at random to be placed into an available team. The script attempts to put that person in his or her Round 2 pick if there is room; if not, it will attempt his or her Round 3 pick, and so on until they find a tema with space available. This continues until the pool of free agents is exhausted.

### Why do it this way?

The social committee agreed the best way to assign teams for the escape rooms was by random lottery, giving participants the opportunity to decide which rooms they preferred to be in the most and least. Our motivations were two-fold: a random lottery was far simpler to manage in the scale of participants and gave everyone equal opportunity to get into a room they were comfortbale with (if not the one they were *most* comfortable with), and this also would cerate opportunities for us to forge new relationships with people we don't commonly work or associate with in navigating the rooms challenges.

The script produces output to describe the process it went through to place people on teams. The output of the official run will be posted here once this script has been fairly scrutinized by the masses and has been run.
