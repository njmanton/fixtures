function League() {
	/*
	constructor function for League object
	*/
	this.title = '';			// title of league
	this.subtitle = '';		// subtitle (opt.)
	this.summary = '';		// summary of competition
	this.id = genUid(12);	// unique ID
	this.type = null;			// type (rr/de etc.)
	this.subtype = 0;			// subtype (home/away etc.)
	this.teams = [];			// array of competing teams
	this.rr = [];					// array of round robin events
	this.de = [];					// array of direct elimination events
	this.dateint = 0;			// interval between rounds

	// DOM elements
	this.container = $('#schedule');		// contains the output
	this.list = $('#c_teams li');				// holds the team list

	// text for displaying fixtures
	this.byetext = '%s has a bye';
	this.byeweektext = '%s doesn\'t play this week';
	this.vstext = '%s vs %s';

	/*
	recalc - calls the appropriate calculation method
	*/
	this.recalc = function() {
		if (this.type === 0) {
			this.calcRR();
		} else {
			this.calcDE();
		}
	}

	this.redraw = function(recalc) {
		/*
		this fn takes the current team array, calculates the fixtures and writes
		out some html to display
		*/

		if (recalc === true) {
			if (this.type === 0) {
				this.calcRR();
			} else if (this.type === 1) {
				this.calcDE();
			}
		}

		// add titles
		this.container.children().remove();
		this.container.append(__('<h2>%s</h2>', this.title));
		this.container.append(__('<h3>%s</h3>', this.subtitle));

		if (this.type === 0 && this.teams.length >= 2) {
				var s = '';
				for (var x = 0; x < this.rr.length; x++) {
					s += this.rr[x][0] + '<br />';
					for (var y = 1; y < this.rr[x].length; y++) {
						s += y + ': ' + this.rr[x][y] + '<br />';
					}
				}
				this.container.append(__('<p>%s</p>', s));
		} else if (this.type === 1 && this.teams.length >= 2) {
			
			// get the size of the de bracket based on teams (next highest power of two)
			var roundSize = Math.pow(2, Math.ceil(Math.log2(this.teams.length)));
			var s = __('Round of %s<br />', roundSize);
			for (var x = 0; x < this.de.length; x++) {
				s+= this.de[x] + '<br />';
			}
			this.container.append(__('<p>%s</p>', s));
		}
	}

	this.calcRR = function() {
		/*	name		calcRoundRobin
				ret 		true if output array is non-empty
				desc		recreates the output array for a round robin tournament	*/
		if (this.teams.length > 1) {
			var schedule = roundRobin((this.teams.length));
			var sd = $('#startdate').val();
			this.rr.length = 0;
			for (var x = 0; x <= schedule.length - 1; x++) {
				var r = [];
				var roundHeader = __('Round %s:', (x + 1));
				
				if (sd) {
					var di = this.dateint;
					newdate = moment(sd).add(x * di, 'days').format('ddd D MMM YY');
					roundHeader +=  __(' (%s)', newdate);
				}
				r.push(roundHeader);
				for (var y = 0; y <= schedule[x].length - 1; y++) {
					var f = [];
					var home = this.teams[schedule[x][y][0] - 1];
					var away = this.teams[schedule[x][y][1] - 1];
					if (home === undefined) {
						f.push(__(this.byeweektext, away));
					} else if (away === undefined) {
						f.push(__(this.byeweektext, home));
					} else {
						f.push(__(this.vstext, [home, away]));
					}
					r.push(f);
				}
				this.rr.push(r);
			}
			this.summary = 'There are ' + this.teams.length + ' teams ';
			return (this.rr.length > 0);			
		}
	}

	this.calcDE = function() {
		/*	name		calcDE
				ret 		true if output array is non-empty
				desc		recreates the output array for a DE tournament	*/
		var tcount = this.teams.length;
		var roundCount = Math.ceil(Math.log(tcount)/Math.log(2));
		var firstBracket = Math.pow(2, roundCount);
		var byes = (firstBracket - tcount);

		var teamlist = JSON.parse(JSON.stringify(this.teams)); // clone the teams array

		if (this.subtype === 1) {
			teamlist = shuffle(teamlist);
			console.log(teamlist);
		}

		if (tcount > 1) {
			this.de.length = 0;
			var c = (firstBracket / 2) + 1;
			for (var x = 1; x < c; x++) {
				if (x <= byes) {
					this.de.push(__(this.byetext, teamlist[x-1]));
				} else {
					this.de.push(__(this.vstext, [teamlist[x-1], teamlist[(firstBracket-x)]]));
				}
			}
		}
	}

	this.build = function() {
		/*
		this destroys the current teams array, and rebuilds it from the team list
		*/
		this.teams.length = 0;
		var ts = [];
		var lst = this.list;
		$('#c_teams li').each(function(i) {
			var tm = $(this).find('.team_name').text();
			ts.push(tm);
		})
		this.teams = ts;
		this.redraw(true);
	}

} // end League function
