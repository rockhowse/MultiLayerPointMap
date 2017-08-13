
function loadStarmap(star_map_index) {

    // reset the volume container to the mid always for consistency
    //data_volume_container.position.x =  -2100;
    //data_volume_container.position.y =  -1050;
    //data_volume_container.position.z = z_fits_it_sits;

    // this used to animate but that has been moved to the buildMapFromHistoricalData() for better syncronization
    if(star_map_index == 0) {
        loadBatsStarMap(scene, camera);
    } else if(star_map_index == 1) {
        loadFacebookStarMap(scene, camera);
    } else if (star_map_index == 2) {
        loadKCGStarMapGrid(scene, camera);
    } else if (star_map_index == 3) {
        borg_container = null;// make it eligible for GC
        loadTweetFallStarMap(scene, camera)
    } else if (star_map_index == 4) {
        loadFlashCrashStarMapGrid(scene, camera);
    }
}

var sec_to_move = 2;
var sec_per_stage = 5;

function flyToDay(graph_loc, star_map, zoom_x, star_map_index) {
    var max = Math.max(star_map.p_x_offset, star_map.p_y_offset);
    var new_z = max*4;

    showStarmapInfo(star_map.star_map_info);

    playAnimation(star_map, star_map_index);

    /* was used to zoom through container
    // move this to the X loc specified
    var tween = new TWEEN.Tween(data_volume_container.position).to({
        x: graph_loc
    }, sec_to_move * 1000/2).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
        }).onComplete(function () {

            // move the volume container behind us
            var tween = new TWEEN.Tween(data_volume_container.position).to({
                y: -50,
                z: 1100
            }, sec_to_move * 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                }).onComplete(function () {
                    setTimeout(function() {
                        playAnimation(star_map, star_map_index)
                        //returnFromDay(star_map, star_map_index);
                    }, 1000)
                }).start();
        }).start();
     */
}

// this function returns the camra back to it's position ready to fly back into another day
function returnFromDay(three_obj, star_map_index) {
/* this used to hide the data container, no longer zooming through it
    // slide data_volume_container back along the z access
    var tween = new TWEEN.Tween(data_volume_container.position).to({
        z: z_fits_it_sits
    }, 3 * 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
            // do nothing
        }).onComplete(function () {

            // now put it back in the middle
            var tween = new TWEEN.Tween(data_volume_container.position).to({
                x: -2100,
                y: -1050,
                z: z_fits_it_sits
            }, 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                    // do nothing
                }).onComplete(function () {
                    hideStarmapInfo()
                    // load the next starmap
                    //loadStarmap(++star_map_index)
                }).start();
        }).start();
*/

    // hide the starmap info
    hideStarmapInfo()

    // slide star_map back behind other plane
    var tween = new TWEEN.Tween(three_obj.position).to({
        z: hide_plane_x-5000
    }, sec_to_move * 1000/4).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
            // do nothing
        }).onComplete(function () {
        }).start();
}

showStarmapInfo = function (star_map_info) {
    $('#star_map_title').show()
    $('#star_map_date').show()
    $('#star_map_time').show()
    $('#star_map_description').show()
    if(typeof star_map_info != 'undefined')
    {
        $('#star_map_title').html("" + star_map_info.title);
        $('#star_map_date').html("" + star_map_info.date);
        $('#star_map_time').html("" + star_map_info.time);
        $('#star_map_description').html("" + star_map_info.description);
    }
}

hideStarmapInfo = function() {
    $('#star_map_title').hide()
    $('#star_map_date').hide()
    $('#star_map_time').hide()
    $('#star_map_description').hide()
}

// play animation based on index and debug
playAnimation = function (star_map, star_map_index){
     if(enable_debug) {
        playRotationAnimation(star_map, 40000, borg_container, true);
    } else{
        playFlashcrashBorgAnimation(star_map, star_map_index);
    }
}


/**
 * Generic animation that rotates to flat and back
 *
 * @param star_map
 */
playRotationAnimation = function (star_map, new_z_override, star_map_container, use_container_for_star_map){
    var max = Math.max(star_map.p_x_offset, star_map.p_y_offset);
    var new_z = max*4;

    if(new_z_override && new_z_override != 0){
        new_z = new_z_override;
    }

    // stop animation
    rotate_star_map = false;

    var sec_per_stage = 3;

    var cur_star_map = star_map.hist_star_map;
    var container = cur_star_map;

    // if we pass in a container, we want to zoom that first so we can rotate local axis
    if(star_map_container != null && star_map_container) {
        container = star_map_container;
    }

    // for the last one, we want to rotate the entire container, not just the first starmap
    if(use_container_for_star_map) {
        cur_star_map = container;
    }

    // move the starmap up to 0
    var tween = new TWEEN.Tween(container.position).to({
        z: 0
    }, sec_per_stage* 1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
            // do nothing
        }).onComplete(function () {
        var tween = new TWEEN.Tween(cur_star_map.rotation).to({
            z: Math.PI/2,
            x: -Math.PI/2.4
        }, sec_per_stage* 1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
                // do nothing
            }).onComplete(function () {

                var tween = new TWEEN.Tween(cur_star_map.rotation).to({
                    z: 0,
                    x: 0
                }, sec_per_stage* 1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
                        // do nothing
                    }).onComplete(function () {

                    }).start();

                /*
                 var tween2 = new TWEEN.Tween(cur_star_map.position).to({
                 z: cur_star_map.position.z+(star_map.p_x_offset*2)+new_z/2,
                 y: cur_star_map.position.y-2000
                 }, sec_per_sage* 1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
                 // do nothing
                 }).onComplete(function () {
                 var tween = new TWEEN.Tween(cur_star_map.rotation).to({
                 z: -Math.PI/2
                 }, sec_per_sage* 1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
                 // do nothing
                 }).onComplete(function () {
                 var tween2 = new TWEEN.Tween(cur_star_map.position).to({
                 z: cur_star_map.position.z-(cur_star_map.p_x_offset)*2
                 }, sec_per_sage* 1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
                 // do nothing
                 }).onComplete(function () {

                 }).start();
                 }).start();
                 }).start();
                 */
            }).start();
    }).start();

    // move the camera back to a decent spot
    var tween = new TWEEN.Tween(camera.position).to({
        z: new_z
    }, sec_per_stage* 1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
            // do nothing
        }).onComplete(function () {
            // do nothing
   }).start();
}

showFlashCrashVideo = function() {

   $("#fc_video_tag").show()
   $("#fc_video_tag").get(0).play();
}

playFlashcrashBorgAnimation = function (star_map_index){

    var front_star_map = hist_star_maps[0];

    var front_max = Math.max(front_star_map.p_x_offset, front_star_map.p_y_offset);
    var front_new_z = front_max*4;

    var borg_speed = sec_per_stage/1.5;

    // zoom forward to first starmap (flash crash)
    var tween = new TWEEN.Tween(borg_container.position).to({
        z: -40000 // hard coded for now
    }, borg_speed* 1000/2).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
            // do nothing
        }).onComplete(function () {
        var tween = new TWEEN.Tween(borg_container.rotation).to({
            z: Math.PI/2,
            x: -Math.PI/2.4
        }, borg_speed* 1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
                // do nothing
            }).onComplete(function () {

                var tween = new TWEEN.Tween(borg_container.position).to({
                    y: 5000*4
                }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                        // do nothing
                    }).onComplete(function () {

                        var tween = new TWEEN.Tween(borg_container.rotation).to({
                            z: -Math.PI/120
                        }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                // do nothing
                            }).onComplete(function () {
                                var tween = new TWEEN.Tween(borg_container.position).to({
                                    y: borg_container.position.y - 5000*3
                                }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                        // do nothing
                                    }).onComplete(function () {
                                        var tween = new TWEEN.Tween(borg_container.rotation).to({
                                            z: -Math.PI/2
                                        }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                                // do nothing
                                            }).onComplete(function () {
                                                var tween = new TWEEN.Tween(borg_container.position).to({
                                                    y: 5000*4
                                                }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                                        // do nothing
                                                    }).onComplete(function () {
                                                        var tween = new TWEEN.Tween(borg_container.rotation).to({
                                                            z: -Math.PI
                                                        }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                                                // do nothing
                                                            }).onComplete(function () {
                                                                var tween = new TWEEN.Tween(borg_container.position).to({
                                                                    y: borg_container.position.y - 5000*3
                                                                }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                                                        // do nothing
                                                                    }).onComplete(function () {
                                                                         var tween = new TWEEN.Tween(borg_container.position).to({
                                                                         x: borg_container.position.x + 11500
                                                                         }, borg_speed* 1000/2).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                                                         // do nothing
                                                                         }).onComplete(function () {

                                                                         var tween = new TWEEN.Tween(borg_container.position).to({
                                                                         z: borg_container.position.z + 50000,
                                                                         y: borg_container.position.y - 6400
                                                                         }, borg_speed* 1000/2).easing(TWEEN.Easing.Linear.None).onUpdate(function () {

                                                                         }).onComplete(function () {
                                                                                 var tween = new TWEEN.Tween(borg_container.position).to({
                                                                                     z: borg_container.position.z + 6000,
                                                                                     y: borg_container.position.y - 2000
                                                                                 }, borg_speed* 1000/7).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                                                                         hideStarmapInfo()
                                                                                     }).onComplete(function () {
                                                                                         showFlashCrashVideo();
                                                                                     }).start();

                                                                         }).start();

                                                                         var tween = new TWEEN.Tween(borg_container.rotation).to({
                                                                         x: -Math.PI/2.2
                                                                         }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                                                         // do nothing
                                                                         }).onComplete(function () {

                                                                         }).start();
                                                                         }).start();
                                                                    }).start();
                                                            }).start();

                                                        // rotate labels
                                                        for(var j=0; j < hist_star_maps.length; j++) {

                                                            var cur_star_map = hist_star_maps[j];

                                                            for(var i=0; i < cur_star_map.marker_labels.length;i++) {
                                                                // rotate to the side with slight angle up the plane
                                                                var tween = new TWEEN.Tween(cur_star_map.marker_labels[i][4].rotation).to({
                                                                    y: Math.PI
                                                                }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                                                    }).onComplete(function () {
                                                                    }).start();
                                                            }
                                                        }
                                                    }).start();
                                            }).start();
                                        // rotate labels
                                        for(var j=0; j < hist_star_maps.length; j++) {

                                            var cur_star_map = hist_star_maps[j];

                                            for(var i=0; i < cur_star_map.marker_labels.length;i++) {
                                                // rotate to the side with slight angle up the plane
                                                var tween = new TWEEN.Tween(cur_star_map.marker_labels[i][4].rotation).to({
                                                    y: Math.PI/2
                                                }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                                    }).onComplete(function () {
                                                    }).start();
                                            }
                                        }
                                    }).start();
                            }).start();

                        // roate labels
                        for(var j=0; j < hist_star_maps.length; j++) {

                            var cur_star_map = hist_star_maps[j];

                            for(var i=0; i < cur_star_map.marker_labels.length;i++) {
                                // rotate to the side with slight angle up the plane
                                var tween = new TWEEN.Tween(cur_star_map.marker_labels[i][4].rotation).to({
                                    y: -Math.PI/120
                                }, borg_speed* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
                                    }).onComplete(function () {
                                    }).start();
                            }
                        }
                    }).start();
            }).start();

        // move the labels to face the camera since when rotating the parent, the object.lookAt(camera.position) doesn't work?
        // update the markers to face the camera
        // tried doing lookAt(camera.position) but evidently there is an issue with children if you rotate the parent
        for(var j=0; j < hist_star_maps.length; j++) {

            var cur_star_map = hist_star_maps[j];

            for(var i=0; i < cur_star_map.marker_labels.length;i++) {
                // rotate to the side with slight angle up the plane
                var tween = new TWEEN.Tween(cur_star_map.marker_labels[i][4].rotation).to({
                    y: Math.PI/-2,
                    x: Math.PI/2
                }, borg_speed* 1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {
                    }).onComplete(function () {
                    }).start();
            }
        }
    }).start();
}

returnToHome  = function(three_obj, new_z, star_map_index) {

    var tween = new TWEEN.Tween(three_obj.rotation).to({
        z: 0,
        x: 0
    }, sec_per_stage* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
            // do nothing
        }).onComplete(function () {
        }).start();

    var tween = new TWEEN.Tween(three_obj.position).to({
        y: 0,
        x: 0,
        z: -new_z*2
    }, sec_per_stage* 1000).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
            // do nothing
        }).onComplete(function () {
            returnFromDay(three_obj, star_map_index)
        }).start();
}

