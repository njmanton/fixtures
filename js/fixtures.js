function initFixtures() {

	$('#c_title').on('change', function() {
		league.title = this.value;
		league.redraw(false);
	});

	$('#c_subtitle').on('change', function() {
		league.subtitle = this.value;
		league.redraw(false);
	});

	$('#formats input[name=c_format]').on('click', function() {
		if (this.value === 'rr') {
			$('#rr_options').show().next().hide();
			league.type = 0;
		} else if (this.value === 'de') {
			$('#rr_options').hide().next().show();
			league.type = 1;
		}
		league.redraw(true);
	})

	$('#formats input[name=rr_sub]').on('click', function() {
		if (this.value === 'homeaway') {
			league.subtype = 1;
		} else {
			league.subtype = 0;
		}
		league.redraw(true);
	})

	$('#formats input[name=de_sub]').on('click', function() {
		if (this.value === 'freedraw') {
			league.subtype = 1;
		} else {
			league.subtype = 0;
		}
		league.redraw(true);
	})

	$('#export').on('click', function() {
		// do something with $('#format option:selected').val();
	})

	$('input[name="period"]').on('change', function() {
		
		if ($(this).val() == 'other') {
			$('#otherperiod').removeAttr('disabled');
		} else {
			$('#otherperiod').attr('disabled', 'disabled');
			if ($(this).val() == 'day') {
				league.dateint = 1;
			} else if ($(this).val() == 'week') {
				league.dateint = 7;
			}
		}
		league.redraw();
		
	})

	$('#otherperiod').on('change', function() {
		league.dateint = Number($(this).val());
		league.redraw();
	})

	$('.sortable').on('click', '.team_delete', function() {
		$(this).parent().parent().remove();
		league.build();
	})

	$('.sortable').on('click', '.team_edit', function() {
		// when edit button is clicked, turn the label into an input box
		var lbl = $(this).parent().parent().find('.team_name');
		var team = lbl.text();
		lbl.replaceWith(__('<input class="rename" autofocus="on" type="text" value="%s" />', team));
	}).on('change', '.rename', function() {
		var newname = $(this).val();
		idx = $(this).parent().index();
		// see if the new team already exists
		// if it doesn't replace the array element selected with the new name
		if (checkDups(newname) == -1) {
			league.teams[idx] = newname;
			$(this).replaceWith(__('<span class="team_name">%s</span>', newname));
			league.build();
		}	else {
			$(this).replaceWith(__('<span class="team_name">%s</span>', league.teams[idx]));
		}
	})

	$('#c_newteam').on('change', function() {
		var slist = $('#schedule');
		var t = this.value.replace(/&/g, '&amp;')
											.replace(/</g, '&lt;')
											.replace(/>/g, '&gt;')
											.replace(/%s/, '')
											.replace(/"/g, '');

		// check to see if entered team already exists in list
		if (checkDups(t) == -1) {
			app = __(c, t);
			list.sortable('destroy'); // delete the current sortable list
			list.append (app);
			list.sortable({	handle: '.handle'	}); // then make it sortable again with new element
		}
		this.value = '';
		league.build();
	})	
	
	$('.sortable').sortable({ handle: '.handle' }).bind('sortupdate', function() {
		// called when sorting finished
		league.build();
	});

} // end initfixtures
