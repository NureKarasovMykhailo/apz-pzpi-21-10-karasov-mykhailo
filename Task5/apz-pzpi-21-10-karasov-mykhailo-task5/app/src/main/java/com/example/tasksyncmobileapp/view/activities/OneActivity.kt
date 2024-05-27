package com.example.tasksyncmobileapp.view.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.lifecycle.lifecycleScope
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.controller.ActivityController
import com.example.tasksyncmobileapp.databinding.ActivityOneBinding
import com.example.tasksyncmobileapp.model.Activity
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.ActivityRepository
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.util.functions.getTimeInHoursAndMinutes
import com.example.tasksyncmobileapp.view.HeaderFragment
import kotlinx.coroutines.launch

class OneActivity : AppCompatActivity() {
    private lateinit var binding: ActivityOneBinding
    private lateinit var activitiesIntent: Intent
    private lateinit var activityController: ActivityController
    private lateinit var tokenManager: TokenManager
    private lateinit var updateActivityIntent: Intent
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOneBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        setProgressBarVisible()

        val activityId = intent.getIntExtra("ACTIVITY_ID", -1)
        val retrofitClient = RetrofitClient()
        val activityRepository = ActivityRepository(retrofitClient.apiService)

        activityController = ActivityController(activityRepository)
        activitiesIntent = Intent(this, ActivitiesActivity::class.java)
        tokenManager = TokenManager(binding.root.context)

        setActivity(activityId)

        binding.apply {
            bOneActivityBack.setOnClickListener {
                startActivity(activitiesIntent)
            }

            bOneActivityUpdate.setOnClickListener {
                updateActivityIntent = Intent(binding.root.context, UpdateActivity::class.java).apply {
                    putExtra("ACTIVITY_ID", activityId)
                }
                startActivity(updateActivityIntent)
            }

            bOneActivityDelete.setOnClickListener {
                val token = tokenManager.getToken()
                if (token != null) {
                    lifecycleScope.launch {
                        activityController.deleteActivity(token, activityId)
                        startActivity(activitiesIntent)
                    }
                }
            }
        }
    }

    private fun setProgressBarVisible() {
        binding.apply {
            tvOneActivityComplexity.visibility = View.INVISIBLE
            tvOneActivityDescription.visibility = View.INVISIBLE
            tvOneActivityEducation.visibility = View.INVISIBLE
            tvOneActivityTitle.visibility = View.INVISIBLE
            tvOneActivityTimeShift.visibility = View.INVISIBLE
            tvOneActivityRequiredWorkerCount.visibility = View.INVISIBLE

            oneActivityProgressBar.visibility = View.VISIBLE
        }
    }

    private fun setActivity(activityId: Int) {
        val token = tokenManager.getToken()
        if (token != null) {
            lifecycleScope.launch {
                val result = activityController.getActivityById(token, activityId)
                result.onSuccess { response ->
                    val activity = response.activity
                    setDataVisible(activity)

                }
            }
        }
    }

    private fun setDataVisible(activity: Activity) {
        binding.apply {

            tvOneActivityComplexity.text = "Складність: ${activity.complexity.complexityTitle}"
            tvOneActivityDescription.text = "Опис: ${activity.description}"
            tvOneActivityEducation.text = "Необхідна освіта: ${activity.education.educationTitle}"
            tvOneActivityTitle.text = activity.activityTitle
            tvOneActivityTimeShift.text = "Час робочої зміни: ${getTimeInHoursAndMinutes(activity.timeShift)}"
            tvOneActivityRequiredWorkerCount.text = "Необхідна кількість робітників: ${activity.requiredWorkerCount.toString()}"

            tvOneActivityComplexity.visibility = View.VISIBLE
            tvOneActivityDescription.visibility = View.VISIBLE
            tvOneActivityEducation.visibility = View.VISIBLE
            tvOneActivityTitle.visibility = View.VISIBLE
            tvOneActivityTimeShift.visibility = View.VISIBLE
            tvOneActivityRequiredWorkerCount.visibility = View.VISIBLE

            oneActivityProgressBar.visibility = View.GONE
        }
    }
}